import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Connection from './connection.ts';
import FileBrowser from './file-browser.tsx';
import Preview from './preview.tsx';
import SeqGenerator from './seq-generator.ts';
import { Grid, Row, Col } from 'react-bootstrap';

interface IProps {
  connection: Connection;
  seq: IterableIterator<number>;
  home: string;
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
interface IPreview {
  id: number;
  command: string;
  lines: string[];
}

interface IState {
  browser?: IBrowser;
  preview?: IPreview;
}

class Main extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = { };

    this.ls(this.props.home).then((browser: IBrowser) => {
      this.setState({ browser });
    });
  }

  public render(): JSX.Element {
    const panels: JSX.Element[] = [];
    if (this.state.browser) {
      const { path, files } = this.state.browser;
      const cat = (filepath: string) => {
        const seq = this.props.seq.next().value;
        const key = this.props.connection.key;
        const catResult = this.props.connection.send({
          seq,
          key,
          type: 'cat',
          path: filepath,
        });
        catResult.then((result: { id: number, command: string, lines: string[] }) => {
          const { id, command, lines } = result;
          const preview = { id, command, lines };
          this.setState({ preview });
        });
      };
      const changeDir = (path: string) => {
        this.ls(path)
        .then((browser: IBrowser) => {
          this.setState({ browser });
        });
      };
      panels.push(<FileBrowser files={files} path={path} home={this.props.home} cat={cat} changeDir={changeDir} onClick={(e: React.MouseEvent, path: string, isFile: boolean) => {
      }}></FileBrowser>);
    }
    if (this.state.preview) {
      const { command, lines, id } = this.state.preview;
      panels.push(<Preview id={id} command={command} lines={lines} />);
    }
    return <div>
    {panels}
    </div>;
  }

  private ls(path: string): Promise<IBrowser> {
    return ls(path, this.props.connection, this.props.seq);
  }
}

export default function render(target: HTMLDivElement, connection: Connection): void {
  const seqGen = SeqGenerator();
  home(connection, seqGen).then((homePath: string) => {
    ReactDOM.render(<Main home={homePath} connection={connection} seq={seqGen}/>, target);
  });
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
