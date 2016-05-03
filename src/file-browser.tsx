import * as React from 'react';
import Connection from './connection.ts';
import File from './file.tsx';
import FileInfo from './file-info.tsx';
import { Col, Input } from 'react-bootstrap';

class Path extends React.Component<{}, {}> {
  constructor(props: {}) {
    super(props);
  }

  public render(): JSX.Element {
    return <Input type='text' value={this.props.children} readOnly />;
  }
}

interface IProps {
  connection: Connection;
  seq: IterableIterator<number>;
  onClick: (e: React.MouseEvent, path: string, isFIle: boolean) => void;
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
  selected?: number;
}

export default class FileBrowser extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {};
    const seq = this.props.seq.next().value;
    const key = this.props.connection.key;
    props.connection.send({seq, key, type: 'pwd'}).then((result: {pwd: string}) => {
      const path = result.pwd;
      this.setState({ path });
      return path;
    }).then((path: string) => {
      const seq = this.props.seq.next().value;
      return props.connection.send({seq, key, path, type: 'ls'}).then((result: {files: IFile[]}) => {
        this.setState({files: result.files});
      });
    });
  }

  public render(): JSX.Element {
    let files = <div>'Loading...'</div> as any;
    let selectedFile = { } as any;
    if (this.state.files) {
      files = this.state.files.map((file: IFile, key: number) => {
        if (key === this.state.selected) {
          selectedFile = file;
        }
        const selected = key === this.state.selected;
        return <File
          selected={selected}
          key={key}
          {...file}
          onClick={(e: React.MouseEvent) => this.props.onClick(e, `${this.state.path}/${file.name}`, file.is_file)}
        />;
      });
    }
    return (
      <div className='file-browser'>
      <Path>{this.state.path}</Path>
      <Col xs={8}>
        {files}
      </Col>
      <Col xs={4}>
        <FileInfo {...selectedFile} />
      </Col>
      </div>
    );
  }
}
