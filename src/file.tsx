import * as React from 'react';

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

interface IFileProps extends IFile {
  selected: boolean;
  onClick: React.MouseEventHandler;
}

export default class File extends React.Component<IFileProps , {}> {
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

