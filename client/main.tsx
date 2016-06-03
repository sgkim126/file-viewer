import * as React from 'react';
import * as ReactDOM from 'react-dom';
import CommandOption from './options.ts';
import Connection from './connection.ts';
import FileBrowser from './file-browser.tsx';
import IFile from './ifile.ts';
import IMoreResult from './imoreresult.ts';
import IBrowser from './ibrowser.ts';
import IResult from './iresult.ts';
import Message from './messages.ts';
import Results from './results.tsx';
import { Button, Col } from 'react-bootstrap';
import { ICommandInput } from './messages.ts';

interface IProps {
  connection: Connection;
  seq: IterableIterator<number>;
  root: string;
}

interface IState {
  browser?: IBrowser;
  results?: IResult[];
  show_result_id?: number;
  columns?: Map<string, IFile[]>[];
}

export default class Main extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    const browser: IBrowser = {
      path: "",
      files: [],
    };
    const results: IResult[] = [];
    this.state = { browser, results, show_result_id: -1,
      columns: [],
    };

    this.ls(this.props.root).then((browser: IBrowser) => {
      this.setState({ browser });
    });
  }

  public render(): JSX.Element {
    const onCommand = (command: string, input: ICommandInput, option: CommandOption) => {
      const seq = this.props.seq.next().value;
      const token = this.props.connection.token;
      const message: Message = { seq, token, type: 'command', command, input, option };
      const result = this.props.connection.send(message).then((result: IResult) => {
        const show_result_id = result.id;
        const results = this.state.results.slice();
        results.push(result);
        this.setState({ results, show_result_id });
      });
    };
    const panels: JSX.Element[] = [];
    const { path, files } = this.state.browser;
    const results = this.state.results.map((result: IResult, key: number) => {
      const onClick = () => {
        const show_result_id = result.id;
        this.setState({ show_result_id });
      };
      return <Button key={result.id} block bsSize='large' onClick={onClick} title={result.command}>{result.name}</Button>;
    });

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

    return <div className='full-width full-height'>
      <Col xs={6} className='full-height'>
        <FileBrowser
          ls={this.ls.bind(this)}
          root={this.props.root} rootFiles={files} columns={this.state.columns}
          openDir={openDir}
          onCommand={onCommand} onClick={(e: React.MouseEvent, path: string, isFile: boolean) => {
        }} />
      </Col>
      <Col xs={1}>{results}</Col>
      <Col xs={5} className='full-height'>
        <Results show={this.state.show_result_id} readMore={this.readMore.bind(this)} results={this.state.results} />
      </Col>
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
