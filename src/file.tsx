import './file.styl';
import * as React from 'react';
import { Overlay } from 'react-bootstrap';

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

interface IProps extends IFile {
  selected: boolean;
  onClick: React.MouseEventHandler;
}

interface IState {
  menu: boolean;
}

export default class File extends React.Component<IProps , IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { menu: false };
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
    return <div className={outerClasses.join(' ')} onClick={this.props.onClick} onContextMenu={this.onContextMenu.bind(this)}>
      <div><span className={iconClass.join(' ')}></span></div>
      <span className='filename' title={this.props.name}>{this.props.name}</span>
      <Overlay show={this.state.menu} container={this} onHide={()=>{this.setState({menu: false})}} rootClose>
        <div className='menu'>MENU</div>
      </Overlay>
    </div>;
  }

  private onContextMenu(e: MouseEvent): void {
    e.preventDefault();
    this.setState({ menu: true });
  }
}

