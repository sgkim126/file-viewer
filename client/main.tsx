import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Commander from './commander.tsx';
import Connection from './connection.ts';
import FileBrowser from './file-browser.tsx';
import IBrowser from './ibrowser.ts';
import ICommandOption from './icommandoption.ts';
import IFailure from './ifailure.ts';
import IFile from './ifile.ts';
import IMoreResult from './imoreresult.ts';
import IPending from './ipending.ts';
import IResult from './iresult.ts';
import ISuccess from './isuccess.ts';
import ISelected from './iselected.ts';
import Message from './messages.ts';
import Results from './results.tsx';
import { Col, Row } from 'react-bootstrap';

interface IProps {
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

    this.ls(this.props.root).then((browser: IBrowser) => {
      this.setState({ browser });
    });
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
        const results = this.state.results.map((result: IResult) => {
          if (result.seq === resultSeq) {
            return { seq: resultSeq, success };
          }
          return result;
        });
        this.setState({ results, resultSeq });
      }, (failure: IFailure) => {
        failure.name = command;
        failure.command = command;
        const resultSeq = failure.seq;
        const results = this.state.results.map((result: IResult) => {
          if (result.seq === seq) {
            return { seq: resultSeq, failure };
          }
          return result;
        });
        this.setState({ results, resultSeq });
      });
    };
    const panels: JSX.Element[] = [];
    const { files } = this.state.browser;

    const openDir = (path: string, columnNumber: number): void => {
      this.ls(path).then(({ files }: IBrowser) => {
        const columns = this.state.columns;
        const column = (columns.length === columnNumber)
          ? new Map<string, IFile[]>()
          : columns[columnNumber];

          if (!column.has(path)) {
            column.set(path, files);
            columns[columnNumber] = column;
            this.setState({ columns });
          }
      });
    };

    const clearSelects = (): void => {
      this.setState({ selecteds: [] });
    };
    const onSelect = (e: React.MouseEvent, selected: ISelected): void => {
      if (e.altKey) {
        if (selected.resultSeq) {
          this.setState({ resultSeq: selected.resultSeq });
        }
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

    return <div className='full-width full-height'>
    <Row>
      <Col xs={12}>
        <Commander openDir={openDir} selecteds={this.state.selecteds} onCommand={onCommand}/>
      </Col>
    </Row>
    <Row>
      <Col xs={7} className='full-height'>
        <FileBrowser
          ls={this.ls.bind(this)}
          root={this.props.root} rootFiles={files} columns={this.state.columns}
          results={this.state.results} resultSeq={this.state.resultSeq}
          clearSelects={clearSelects} onSelect={onSelect} selecteds={this.state.selecteds} />
      </Col>
      <Col xs={5} className='full-height'>
        <Results show={this.state.resultSeq} readMore={this.readMore.bind(this)} results={this.state.results} />
      </Col>
    </Row>
    </div>;
  }

  private ls(path: string): Promise<IBrowser> {
    return ls(path, this.props.connection, this.props.seq);
  }

  private readMore(id: number, start: number, lines: number): Promise<IMoreResult> {
    return readMore(id, start, lines, this.props.connection, this.props.seq);
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

function readMore(id: number, start: number, lines: number, connection: Connection, seqGen: IterableIterator<number>): Promise<IMoreResult> {
  const seq = seqGen.next().value;
  const token = connection.token;

  return connection.send({seq, token, id, start, lines, type: 'more'});
}
