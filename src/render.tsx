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
  path?: string;
  files?: IFile[];
  lines?: string[];
}

class Main extends React.Component<IMainProps, IState> {
  constructor(props: IMainProps) {
    super(props);

    this.state = { lines: [] };

    const seq = this.props.seq.next().value;
    const key = this.props.connection.key;

    this.props.connection.send({seq, key, type: 'pwd'}).then((result: {pwd: string}) => {
      return result.pwd;
    }).then((path: string) => {
      const seq = this.props.seq.next().value;
      return props.connection.send({seq, key, path, type: 'ls'}).then((result: {files: IFile[]}) => {
        this.setState({ path, files: result.files });
      });
    });
  }

  public render(): JSX.Element {
    if (this.state.path && this.state.files) {
      return <div>
      <Preview lines={this.state.lines} />
      <FileBrowser files={this.state.files} path={this.state.path} onClick={(e: React.MouseEvent, path: string, isFile: boolean) => {
        if (!isFile) {
          return;
        }
        const seq = this.props.seq.next().value;
        const key = this.props.connection.key;
        const catResult = this.props.connection.send({
          seq,
          key,
          type: 'cat',
          path: path,
        });
        catResult.then((result: { lines: string[] }) => {
          this.setState({ lines: result.lines });
        });
      }}/>
      <Preview lines={this.state.lines} />
      </div>;
    } else {
      return <div>
      <Preview lines={this.state.lines} />
      </div>;
    }
  }
}

export default function render(target: HTMLDivElement, connection: Connection): void {
  ReactDOM.render(<Main connection={connection} seq={SeqGenerator()}/>, target);
}
