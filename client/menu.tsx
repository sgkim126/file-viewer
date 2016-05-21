import './menu.styl';
import * as React from 'react';
import IFile from './ifile.ts';
import IMenu from './imenu.ts';
import { Button, ButtonGroup, Glyphicon } from 'react-bootstrap';

interface IProps extends IMenu {
  cat: (path: string) => void;
  changeDir: (path: string) => void;
}

export default class Menu extends React.Component<IProps, {}> {
  constructor(props: IProps) {
    super(props);
    this.state = {};
  }

  public render(): JSX.Element {
    const file = this.props.file;
    const { x, y } = this.props;
    const buttons: JSX.Element[] = [];
    if (file.is_file) {
      buttons.push(<Button onClick={() => { this.props.cat(file.name); } }><Glyphicon glyph='eye-open' /></Button>);
    }
    if (file.is_dir) {
      buttons.push(<Button onClick={() => { this.props.changeDir(file.name); } }><Glyphicon glyph='share-alt' /></Button>);
    }
    const style = {
      left: `${x}px`,
      top: `${y}px`,
    };
    return <div style={style} className='file-menu'><ButtonGroup vertical>{buttons}</ButtonGroup></div>;
  }
}
