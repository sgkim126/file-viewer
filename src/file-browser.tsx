import * as React from 'react';
import Connection from './connection.ts';
import File from './file.tsx';
import FileInfo from './file-info.tsx';
import { Col, Input } from 'react-bootstrap';
const Draggable = require('react-draggable');

class Path extends React.Component<{}, {}> {
  constructor(props: {}) {
    super(props);
  }

  public render(): JSX.Element {
    return <Input type='text' value={this.props.children} readOnly />;
  }
}

interface IProps {
  path: string;
  files: IFile[];
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
  selected?: number;
}

export default class FileBrowser extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {};
  }

  public render(): JSX.Element {
    let files = <div>'Loading...'</div> as any;
    let selectedFile = { } as any;
    if (this.props.files) {
      files = this.props.files.map((file: IFile, key: number) => {
        if (key === this.state.selected) {
          selectedFile = file;
        }
        const selected = key === this.state.selected;
        return <File
          selected={selected}
          key={key}
          {...file}
          onClick={(e: React.MouseEvent) => this.props.onClick(e, `${this.props.path}/${file.name}`, file.is_file)}
        />;
      });
    }
    return <Draggable handle='.handle'>
      <div className='file-browser'>
      <Col xs={12} className='handle'>TITLE BAR</Col>
      <Path>{this.props.path}</Path>
      <Col xs={8}>
        {files}
      </Col>
      <Col xs={4}>
        <FileInfo {...selectedFile} />
      </Col>
      </div>
    </Draggable>;
  }
}
