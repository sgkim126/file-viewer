import './file.styl';
import * as React from 'react';
import IFile from './ifile.ts';
import { Button, ButtonToolbar, Glyphicon, Overlay } from 'react-bootstrap';

interface IProps extends IFile {
  selected: boolean;
  onClick: React.MouseEventHandler;
  cat: (filepath: string) => void;
  changeDir: (path: string) => void;
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
    const buttons: JSX.Element[] = [];
    if (this.props.is_file) {
      buttons.push(<Button onClick={this.cat.bind(this)}><Glyphicon glyph='eye-open' /></Button>);
    }
    if (this.props.is_dir) {
      const path = `${this.props.dirpath}/${this.props.name}`;
      buttons.push(<Button onClick={() => { this.props.changeDir(path); }}><Glyphicon glyph='share-alt' /></Button>);
    }
    const outerClasses = ['icon', 'text-center'];
    if (this.props.selected) {
      outerClasses.push('selected');
    }
    return <div className={outerClasses.join(' ')} onClick={this.props.onClick} onContextMenu={this.onContextMenu.bind(this)}>
      {icon(this.props)}
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

function icon(file: IFile): JSX.Element {
  let glyph = 'remove';
  if (file.is_file) {
    glyph = 'file';
  }
  if (file.is_dir) {
    glyph = 'folder-open';
  }
  return <div><Glyphicon glyph={glyph} /></div>;
}
