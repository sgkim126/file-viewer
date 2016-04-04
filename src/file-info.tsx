import { Panel } from 'react-bootstrap';
import * as React from 'react';

interface IFileInfoProps {
  name?: string;
  is_dir?: boolean;
  is_file?: boolean;
  is_symlink?: boolean;
  size?: number;
  number_of_hard_link?: number;
  ctime?: number;
  mtime?: number;
  atime?: number;
  mode?: number;
}

export default class FileInfo extends React.Component<IFileInfoProps, {}> {
  constructor(props: IFileInfoProps) {
    super(props);
  }

  public render(): JSX.Element {
    const name = this.props.name || '';
    const file_type: string[] = [];
    if (this.props.is_dir) {
      file_type.push('Directory');
    }
    if (this.props.is_file) {
      file_type.push('File');
    }
    if (this.props.is_symlink ) {
      file_type.push('Symlink');
    }
    const hard_links = (this.props.number_of_hard_link == null) ? '' : `${this.props.number_of_hard_link}`;
    const size = (this.props.size == null) ? '' : `${this.props.size} Byte`;
    const ctime = this.props.ctime ? `${new Date(this.props.ctime)}` : '';
    const atime = this.props.atime ? `${new Date(this.props.atime)}` : '';
    const mtime = this.props.mtime ? `${new Date(this.props.mtime)}` : '';
    const mode = this.props.mode ? this.props.mode.toString(8) : '';

    const items: JSX.Element[] = [];
    items.push(<div>File type: {file_type.join(' ')}</div>);
    if (this.props.is_file) {
      items.push(<div>Size : {size}</div>);
    }
    items.push(<div>Created at {ctime}</div>);
    items.push(<div>Modified at {mtime}</div>);
    items.push(<div>Accessed at {atime}</div>);

    return <Panel header={name}>{items}</Panel>;
  }
}
