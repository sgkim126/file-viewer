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

interface IState {
  browser?: {
    path: string,
    files: IFile[],
  };
  lines?: string[];
}

class Main extends React.Component<IMainProps, IState> {
  constructor(props: IMainProps) {
    super(props);

    this.state = { };

    const seq = this.props.seq.next().value;
    const key = this.props.connection.key;

    this.props.connection.send({seq, key, type: 'pwd'}).then((result: {pwd: string}) => {
      return result.pwd;
    }).then((path: string) => {
      const seq = this.props.seq.next().value;
      return props.connection.send({seq, key, path, type: 'ls'}).then((result: {files: IFile[]}) => {
        const browser = { path, files: result.files };
        this.setState({ browser });
      });
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
      panels.push(<FileBrowser files={files} path={path} cat={cat} onClick={(e: React.MouseEvent, path: string, isFile: boolean) => {
      }}></FileBrowser>);
    }
    if (this.state.lines) {
      panels.push(<Preview lines={this.state.lines} />);
    }
    return <div>
    {panels}
    </div>;
  }
}

export default function render(target: HTMLDivElement, connection: Connection): void {
  ReactDOM.render(<Main connection={connection} seq={SeqGenerator()}/>, target);
}
