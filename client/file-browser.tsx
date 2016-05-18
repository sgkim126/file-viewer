import * as React from 'react';
import Connection from './connection.ts';
import File from './file.tsx';
import FileInfo from './file-info.tsx';
import Panel from './panel.tsx';
import Path from './path.tsx';
import { Col } from 'react-bootstrap';
const Draggable = require('react-draggable');

interface IProps {
  path: string;
  files: IFile[];
  onClick: (e: React.MouseEvent, path: string, isFIle: boolean) => void;
  cat: (filepath: string) => void;
  changeDir: (path: string) => void;
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
          dirpath={this.props.path}
          selected={selected}
          key={key}
          {...file}
          cat={this.props.cat.bind(this)}
          changeDir={this.props.changeDir.bind(this)}
          onClick={(e: React.MouseEvent) => this.props.onClick(e, `${this.props.path}/${file.name}`, file.is_file)}
        />;
      });
    }
    return <Panel title='files'>
      <Path changeDir={this.props.changeDir} home={this.props.home}>{this.props.path}</Path>
      <Col xs={8} className='file-browser'>
        {files}
      </Col>
      <Col xs={4}>
        <FileInfo {...selectedFile} />
      </Col>
    </Panel>;
  }
}
