import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Commander from './commander.tsx';
import Connection from './connection.ts';
import FileBrowser from './file-browser.tsx';
import IBrowser from './ibrowser.ts';
import ICommandConfig from './icommandconfig.ts';
import ICommandOption from './icommandoption.ts';
import IFailure from './ifailure.ts';
import IFile from './ifile.ts';
import IMoreResult from './imoreresult.ts';
import IPending from './ipending.ts';
import IResult from './iresult.ts';
import ISuccess from './isuccess.ts';
import ISelected from './iselected.ts';
import Message from './messages.ts';
import Selecteds from './selecteds.tsx';
import Results from './results.tsx';
import { Col, Jumbotron, Row } from 'react-bootstrap';

interface IProps {
  configs: ICommandConfig[];

  connection: Connection;
  seq: IterableIterator<number>;
  root: string;
}

interface IState {
  browser?: IBrowser;
  results?: IResult[];
  resultSeq?: number;
  columns?: Map<string, IFile[]>[];

  selecteds?: ISelected[];

  pendings?: IPending[];
}

export default class Main extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    const browser: IBrowser = {
      path: "",
      files: [],
    };
    this.state = { browser,
      results: [], resultSeq: -1,
      columns: [],
      selecteds: [],
      pendings: [],
    };

    this.ls(this.props.root).then((browser: IBrowser) => this.setState({ browser }));
  }

  public render(): JSX.Element {
    const onCommand = (command: string, option: ICommandOption) => {
      const seq = this.props.seq.next().value;
      const token = this.props.connection.token;
      const type = 'command';
      const message: Message = { seq, token, type, command, option } as any;
      const result = this.props.connection.send(message);
      const results = this.state.results.slice();
      results.push({ seq, pending: { seq, command }});
      this.setState({ results });

      result.then((success: ISuccess) => {
        const resultSeq = success.seq;
        const results = this.state.results.map(
          (result: IResult) => result.seq === resultSeq ? { seq: resultSeq, success } : result
        );
        this.setState({ results, resultSeq });
      }, (failure: IFailure) => {
        const resultSeq = failure.seq;
        const results = this.state.results.map(
          (result: IResult) => result.seq === seq ? { seq: resultSeq, failure } : result
        );
        this.setState({ results, resultSeq });
      });
    };
    const { files } = this.state.browser;

    const openDir = (path: string, columnNumber: number): void => {
      this.ls(path).then(({ files }: IBrowser) => {
        const columns = this.state.columns;
        const column = (columns.length === columnNumber) ? new Map<string, IFile[]>() : columns[columnNumber];

          if (!column.has(path)) {
            column.set(path, files);
            columns[columnNumber] = column;
            this.setState({ columns });
          }
      });
    };

    const clearSelects = (e: React.MouseEvent): void => {
      if (e.ctrlKey) {
        return;
      }

      this.setState({ selecteds: [] });
    };
    const onSelect = (e: React.MouseEvent, selected: ISelected): void => {
      if (e.altKey || e.shiftKey) {
        if (selected.seq) {
          this.setState({ resultSeq: selected.seq });
        }
        return;
      }

      if (!selected.input) {
        return;
      }

      if (!e.ctrlKey) {
        this.setState({ selecteds: [ selected ] });
        return;
      }

      const selecteds = this.state.selecteds.filter(({ input }: ISelected) => {
        return input.file !== selected.input.file || input.pipe !== selected.input.pipe;
      });
      if (selecteds.length === this.state.selecteds.length) {
        selecteds.push(selected);
      }
      this.setState({ selecteds });
    };

    const setSelecteds = (selecteds: ISelected[]) => {
      this.setState({ selecteds });
    };

    const closeResult = (seq: number) => {
      const result = this.state.results.find((result: IResult) => result.seq === seq);
      if (result == null) {
        return;
      }
      const results = this.state.results.filter((result: IResult) => result.seq !== seq);

      this.setState({ results });

      if (result.success == null) {
        return;
      }

      close(result.success.seq, this.props.connection, this.props.seq);

      const selecteds = this.state.selecteds.filter((selected: ISelected) => selected.seq !== result.seq);
      this.setState({ selecteds });
    };

    const closeDir = (column: number, path: string) => {
      const { columns } = this.state;
      columns[column].delete(path);
      this.setState({ columns });
    };

    return <div className='full-width full-height'>
    <div className='hidden-xs hidden-sm visible-md visible-lg'>
    <Row><Col md={12} lg={12}>
      <Commander selecteds={this.state.selecteds} onCommand={onCommand} configs={this.props.configs} />
    </Col></Row>
    <Row>
      <Col md={12} lg={12}>
        <Selecteds selecteds={this.state.selecteds} setSelecteds={setSelecteds} />
      </Col>
    </Row>
    <Row>
      <Col md={6} lg={7} className='full-height'>
        <FileBrowser
          ls={this.ls.bind(this)}
          root={this.props.root} rootFiles={files} columns={this.state.columns}
          results={this.state.results} resultSeq={this.state.resultSeq}
          openDir={openDir} closeDir={closeDir}
          clearSelects={clearSelects} onSelect={onSelect} selecteds={this.state.selecteds} />
      </Col>
      <Col md={6} lg={5} className='full-height'>
        <Results show={this.state.resultSeq} readMore={this.readMore.bind(this)} results={this.state.results} closeResult={closeResult} />
      </Col>
    </Row>
    </div>
    <div class='visible-xs visible-sm hidden-md hidden-lg'>
      <Jumbotron>
        <h1>Screen size is too small. Screen width has to be larger than 992px.</h1>
      </Jumbotron>
    </div>
    </div>;
  }

  private ls(path: string): Promise<IBrowser> {
    return ls(path, this.props.connection, this.props.seq);
  }

  private readMore(seq: number, start: number, lines: number): Promise<IMoreResult> {
    return readMore(seq, start, lines, this.props.connection, this.props.seq);
  }
}

function ls(path: string, connection: Connection, seqGen: IterableIterator<number>): Promise<IBrowser> {
  const seq = seqGen.next().value;
  const token = connection.token;

  return connection.send({seq, token, path, type: 'ls'})
  .then((result: {files: IFile[]}): IBrowser => {
    return { path, files: result.files };
  });
}

function readMore(seq: number, start: number, lines: number, connection: Connection, seqGen: IterableIterator<number>): Promise<IMoreResult> {
  const token = connection.token;

  return connection.send({seq, token, start, lines, type: 'more'});
}

function close(seq: number, connection: Connection, seqGen: IterableIterator<number>) {
  const token = connection.token;

  return connection.send({seq, token, type: 'close'});
}
