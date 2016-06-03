const Draggable = require('react-draggable');
const { Form, FormControl, FormGroup, InputGroup } = require('react-bootstrap');
import './result.styl';
import * as React from 'react';
import IMoreResult from './imoreresult.ts';
import IResult from './iresult.ts';
import { Button } from 'react-bootstrap';

interface IProps extends IResult {
  hide: boolean;
  readMore: (id: number, start: number, lines: number) => Promise<IMoreResult>;
}

interface IState extends IMoreResult {
}

export default class Result extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      bytes: 0,
      chars: 0,
      words: 0,
      lines: 0,
      contents: [],
    };

    this.readMore(30);
  }

  public render(): JSX.Element {
    const readAll = () => {
      const lines = this.props.lines - this.state.lines + 1;
      this.readMore(lines);
    };
    const readMore = (e: React.MouseEvent) => {
      e.preventDefault();
      const lines = parseInt((document.getElementById('read-more-lines') as HTMLInputElement).value, 10);
      this.readMore(lines);
    };

    let className = 'full-height result';
    if (this.props.hide) {
      className += ' hidden';
    }

    return <div className={className}>
    <div>{this.props.command}</div>
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
    </div>;
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
