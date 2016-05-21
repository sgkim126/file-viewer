const { Form, FormControl } = require('react-bootstrap');
import './menu.styl';
import * as React from 'react';
import IFile from './ifile.ts';
import IMenu from './imenu.ts';
import CommandOption from './options.ts';
import { Button, ButtonGroup, Glyphicon, Modal } from 'react-bootstrap';
import { ICommandInput } from './messages.ts';

interface IProps extends IMenu {
  onCommand: (command: string, input: ICommandInput, option: CommandOption) => void;
  changeDir: (path: string) => void;
  currentPath: string;
}

interface IState {
  head?: boolean;
}

export default class Menu extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      head: false,
    };
  }

  public render(): JSX.Element {
    const file = this.props.file;
    const { x, y } = this.props;
    let buttons: JSX.Element[] = [];
    if (file.is_file) {
      buttons = buttons.concat(this.showElement());
    }
    if (file.is_dir) {
      buttons.push(this.changeDirElement());
    }
    const style = {
      left: `${x}px`,
      top: `${y}px`,
    };

    const onHead = (e: React.MouseEvent) => {
      e.preventDefault();
      const path = this.path(file.name);
      const lines = parseInt((document.getElementById('head-input') as HTMLInputElement).value, 10);
      this.setState({head: false});
      this.props.onCommand('head', { file: path }, { lines });
    };
    return <div style={style} className='file-menu'>
      <ButtonGroup vertical>{buttons}</ButtonGroup>
      <Modal bsSize='small' show={this.state.head} onHide={() => this.setState({head: false}) }>
        <Modal.Header>head</Modal.Header>
        <Modal.Body><Form onSubmit={onHead}><FormControl type='number' placeholder='--lines' defaultValue={10} id='head-input'/></Form></Modal.Body>
      </Modal>
    </div>;
  }

  private showElement(): JSX.Element[] {
    const file = this.props.file;

    const onCat = (e: React.MouseEvent) => {
      e.preventDefault();
      const path = this.path(file.name);
      this.setState({head: false});
      this.props.onCommand('cat', { file: path }, {});
    };
    return [<Button onClick={() => { this.setState({head: true}); } } block>Head</Button>,
    <Button onClick={onCat} block><Glyphicon glyph='eye-open' /></Button>];
  }
  private changeDirElement(): JSX.Element {
    const file = this.props.file;
    return <Button onClick={() => { this.props.changeDir(file.name); } } block><Glyphicon glyph='share-alt' /></Button>;
  }

  private path(filename: string): string {
    return `${this.props.currentPath}/${filename}`;
  }
}
