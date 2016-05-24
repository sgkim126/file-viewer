const Draggable = require('react-draggable');
const { Form, FormControl } = require('react-bootstrap');
import * as React from 'react';
import CommandOption from './options.ts';
import IResult from './iresult.ts';
import Panel from './panel.tsx';
import { Button, ButtonToolbar, Col, Modal, Nav, NavItem } from 'react-bootstrap';
import { ICommandInput } from './messages.ts';

interface IProps extends IResult {
  onClose: (id: number) => {};
  onCommand: (command: string, input: ICommandInput, option: CommandOption) => void;
}

interface IState {
  head?: boolean;
  tail?: boolean;
  uniq?: boolean;
}

export default class Result extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      head: false,
      tail: false,
      uniq: false,
    };
  }

  public render(): JSX.Element {
    const onHead = (e: React.MouseEvent) => {
      e.preventDefault();
      const lines = parseInt((document.getElementById('head-input') as HTMLInputElement).value, 10);
      this.setState({head: false});
      this.props.onCommand('head', { pipe: this.props.id }, { lines });
    };
    const onTail = (e: React.MouseEvent) => {
      e.preventDefault();
      const lines = parseInt((document.getElementById('tail-input') as HTMLInputElement).value, 10);
      this.setState({tail: false});
      this.props.onCommand('tail', { pipe: this.props.id }, { lines });
    };
    const onUniq = (e: React.MouseEvent) => {
      e.preventDefault();
      this.props.onCommand('uniq', { pipe: this.props.id }, {});
    };

    return <Panel title={this.props.command} onClose={() => { this.props.onClose(this.props.id); }}>
    <ButtonToolbar>
      <Button onClick={() => { this.setState({ head: true }); }}>Head</Button>
      <Button onClick={() => { this.setState({ tail: true }); }}>Tail</Button>
      <Button onClick={onUniq}>Uniq</Button>
    </ButtonToolbar>
    <pre>{this.props.lines.join('\n')}</pre>
    <Modal bsSize='small' show={this.state.head} onHide={() => this.setState({head: false}) }>
      <Modal.Header>head</Modal.Header>
      <Modal.Body><Form onSubmit={onHead}><FormControl type='number' placeholder='--lines' defaultValue={10} id='head-input' autoFocus /></Form></Modal.Body>
    </Modal>
    <Modal bsSize='small' show={this.state.tail} onHide={() => this.setState({tail: false}) }>
      <Modal.Header>tail</Modal.Header>
      <Modal.Body><Form onSubmit={onTail}><FormControl type='number' placeholder='--lines' defaultValue={10} id='tail-input' autoFocus /></Form></Modal.Body>
    </Modal>
    </Panel>;
  }
}
