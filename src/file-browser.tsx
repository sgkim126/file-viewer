import * as React from 'react';
import Connection from './connection.ts';
import { Input, Popover } from 'react-bootstrap';

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

interface IFileProps extends IFile {
  selected: boolean;
  onClick: React.MouseEventHandler;
}

class File extends React.Component<IFileProps , {}> {
  constructor(props: IFileProps) {
    super(props);
  }

  public render(): JSX.Element {
    const iconClass = ['glyphicon'];
    if (this.props.is_file) {
      iconClass.push('glyphicon-file');
    }
    if (this.props.is_dir) {
      iconClass.push('glyphicon-folder-open');
    }
    const outerClasses = ['icon', 'text-center'];
    if (this.props.selected) {
      outerClasses.push('selected');
    }
    return <div className={outerClasses.join(' ')} onClick={this.props.onClick}>
      <div><span className={iconClass.join(' ')}></span></div>
      <span title={this.props.name}>{this.props.name}</span>
    </div>;
  }
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
    if (this.state.files) {
      files = this.state.files.map((file: IFile, key: number) => {
        const selected = key === this.state.selected;
        return <File
          selected={selected}
          key={key}
          {...file}
          onClick={(e: React.MouseEvent) => { this.setState({ selected: key }); }}
        />;
      });
    }
    return (
      <div className='file-browser'>
      <Path>{this.state.path}</Path>
      {files}
      </div>
    );
  }
}
