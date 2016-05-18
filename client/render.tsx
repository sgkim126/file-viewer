import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Connection from './connection.ts';
import FileBrowser from './file-browser.tsx';
import Preview from './preview.tsx';
import SeqGenerator from './seq-generator.ts';
import { Grid, Row, Col } from 'react-bootstrap';

interface IMainProps {
  connection: Connection;
  seq: IterableIterator<number>;
}

interface IFile {
  name: string;
  is_dir: boolean;
  is_file: boolean;
  is_symlink: boolean;
  size: number;
  number_of_hard_link: number;
  ctime: number;
  mtime: number;
  atime: number;
  mode: number;
}

interface IBrowser {
  path: string;
  files: IFile[];
}
interface IState {
  browser?: IBrowser;
  lines?: string[];
}

class Main extends React.Component<IMainProps, IState> {
  constructor(props: IMainProps) {
    super(props);

    this.state = { };

    this.home()
    .then((path: string) => {
      return this.ls(path);
    }).then((browser: IBrowser) => {
      this.setState({ browser });
    });
  }

  public render(): JSX.Element {
    const panels: JSX.Element[] = [];
    if (this.state.browser) {
      const path = this.state.browser.path;
      const files = this.state.browser.files;
      const cat = (filepath: string) => {
        const seq = this.props.seq.next().value;
        const key = this.props.connection.key;
        const catResult = this.props.connection.send({
          seq,
          key,
          type: 'cat',
          path: filepath,
        });
        catResult.then((result: { lines: string[] }) => {
          this.setState({ lines: result.lines });
        });
      };
      const changeDir = (path: string) => {
        this.ls(path)
        .then((browser: IBrowser) => {
          this.setState({ browser });
        });
      };
      panels.push(<FileBrowser files={files} path={path} cat={cat} changeDir={changeDir} onClick={(e: React.MouseEvent, path: string, isFile: boolean) => {
      }}></FileBrowser>);
    }
    if (this.state.lines) {
      panels.push(<Preview lines={this.state.lines} />);
    }
    return <div>
    {panels}
    </div>;
  }

  private home(): Promise<string> {
    return home(this.props.connection, this.props.seq);
  }

  private ls(path: string): Promise<IBrowser> {
    return ls(path, this.props.connection, this.props.seq);
  }
}

export default function render(target: HTMLDivElement, connection: Connection): void {
  ReactDOM.render(<Main connection={connection} seq={SeqGenerator()}/>, target);
}

function home(connection: Connection, seqGen: IterableIterator<number>): Promise<string> {
  const seq = seqGen.next().value;
  const key = connection.key;

  return connection.send({seq, key, type: 'home'})
  .then((result: {home: string}): string => {
    return result.home;
  });
}

function ls(path: string, connection: Connection, seqGen: IterableIterator<number>): Promise<IBrowser> {
  const seq = seqGen.next().value;
  const key = connection.key;

  return connection.send({seq, key, path, type: 'ls'})
  .then((result: {files: IFile[]}): IBrowser => {
    return { path, files: result.files };
  });
}
