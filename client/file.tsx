import './file.styl';
import * as React from 'react';
import IFile from './ifile.ts';
import { Glyphicon } from 'react-bootstrap';

interface IProps extends IFile {
  selected: boolean;
  onClick: React.MouseEventHandler;
  onContextMenu: (x: number, y: number, file: IFile) => void;
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
    const outerClasses = ['icon', 'text-center'];
    if (this.props.selected) {
      outerClasses.push('selected');
    }
    const onContextMenu = (e: React.MouseEvent) => {
      const {pageX, pageY, clientX, clientY, screenX, screenY} = e;
      window['ae'] = {pageX, pageY, clientX, clientY, screenX, screenY};
      e.preventDefault();
      this.props.onContextMenu(e.clientX, e.clientY, this.props);
    };
    return <div className={outerClasses.join(' ')} onClick={this.props.onClick} onContextMenu={onContextMenu}>
      {icon(this.props)}
      <span className='filename' title={this.props.name}>{this.props.name}</span>
    </div>;
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
