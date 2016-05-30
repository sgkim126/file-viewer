const Draggable = require('react-draggable');
const { Form, FormControl, FormGroup, InputGroup } = require('react-bootstrap');
import './result.styl';
import * as React from 'react';
import CommandOption from './options.ts';
import IMoreResult from './imoreresult.ts';
import IResult from './iresult.ts';
import Panel from './panel.tsx';
import { Button, ButtonToolbar, Modal } from 'react-bootstrap';
import { ICommandInput } from './messages.ts';

interface IProps extends IResult {
  onClose: (id: number) => {};
  onCommand: (command: string, input: ICommandInput, option: CommandOption) => void;
  readMore: (id: number, start: number, lines: number) => Promise<IMoreResult>;
}

interface IState extends IMoreResult {
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
      bytes: 0,
      chars: 0,
      words: 0,
      lines: 0,
      contents: [],
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

    const readAll = () => {
      const lines = this.props.lines - this.state.lines + 1;
      this.readMore(lines);
    };
    const readMore = (e: React.MouseEvent) => {
      e.preventDefault();
      const lines = parseInt((document.getElementById('read-more-lines') as HTMLInputElement).value, 10);
      this.readMore(lines);
    };

    return <Panel title={this.props.command} onClose={() => { this.props.onClose(this.props.id); }} className='result-panel'>
    <ButtonToolbar>
      <Button onClick={() => { this.setState({ head: true }); }}>Head</Button>
      <Button onClick={() => { this.setState({ tail: true }); }}>Tail</Button>
      <Button onClick={onUniq}>Uniq</Button>
    </ButtonToolbar>
    <pre>{this.state.contents.join('\n')}</pre>
    <Form onSubmit={readMore}>
      <FormGroup>
        <InputGroup className={this.props.lines === this.state.lines ? 'hidden' : ''}>
          <FormControl type='number' defaultValue={10} id='read-more-lines' />
          <InputGroup.Button><Button type='submit'>lines</Button></InputGroup.Button>
        </InputGroup>
        <Button className={this.props.bytes === this.state.bytes ? 'hidden' : ''} onClick={readAll}>all</Button>
      </FormGroup>
    </Form>
    <div>
      <span>{this.state.bytes}/{this.props.bytes} bytes</span>
      <span>{this.state.chars}/{this.props.chars} chars</span>
      <span>{this.state.words}/{this.props.words} words</span>
      <span>{this.state.lines}/{this.props.lines} lines</span>
    </div>
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

  private readMore(lines: number): void {
    this.props.readMore(this.props.id, this.state.bytes, lines).then((result: IMoreResult) => {
      let { bytes, chars, words, lines, contents } = this.state;
      bytes += result.bytes;
      chars += result.chars;
      words += result.words;
      lines += result.lines;
      if (result.lines !== 0) {
        contents = contents.concat(result.contents);
      }
      this.setState({ bytes, chars, words, lines, contents });
    });
  }
}
