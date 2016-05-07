import './file.styl';
import * as React from 'react';
import { Button, ButtonToolbar, Glyphicon, Overlay } from 'react-bootstrap';

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
  cat: (filepath: string) => void;
  dirpath: string;
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
    const buttons: JSX.Element[] = [];
    if (this.props.is_file) {
      iconClass.push('glyphicon-file');
      buttons.push(<Button onClick={this.cat.bind(this)}><Glyphicon glyph='eye-open' /></Button>);
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
      <Overlay show={this.state.menu} container={this} onHide={() => this.setState({menu: false}) } rootClose>
        <ButtonToolbar>
        {buttons}
        </ButtonToolbar>
      </Overlay>
    </div>;
  }

  private onContextMenu(e: MouseEvent): void {
    e.preventDefault();
    this.setState({ menu: true });
  }

  private cat(): void {
    const path = `${this.props.dirpath}/${this.props.name}`;
    const type = 'cat';
    this.props.cat(path);
    this.setState({menu: false});
  }
}

