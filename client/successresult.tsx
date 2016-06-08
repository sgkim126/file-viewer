const { Form, FormControl, FormGroup, InputGroup } = require('react-bootstrap');
import './result.styl';
import * as React from 'react';
import IMoreResult from './imoreresult.ts';
import ISuccess from './isuccess.ts';
import { Button, Col, Glyphicon, Row, Well } from 'react-bootstrap';
import { findDOMNode } from 'react-dom';

interface IProps extends ISuccess {
  hide: boolean;
  readMore: (seq: number, start: number, lines: number) => Promise<IMoreResult>;

  closeResult: (seq: number) => void;
}

interface IState extends IMoreResult {
}

export default class SuccessResult extends React.Component<IProps, IState> {
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
    let readMoreLinesRef: HTMLInputElement;

    const readAll = () => {
      const lines = this.props.lines - this.state.lines + 1;
      this.readMore(lines);
    };
    const readMore = (e: React.MouseEvent) => {
      e.preventDefault();
      const linesValue = (findDOMNode(readMoreLinesRef) as HTMLInputElement).value;
      if (linesValue === "") {
        return;
      }
      const lines = parseInt(linesValue, 10);
      this.readMore(lines);
    };

    let className = 'full-height result';
    if (this.props.hide) {
      className += ' hidden';
    }

    const closeResult = () => this.props.closeResult(this.props.seq);
    return <div className={className}>
    <Well>{this.props.command}<Button className='close-result' onClick={closeResult}><Glyphicon glyph='remove' /></Button></Well>
    <pre>{this.state.contents.join('\n')}</pre>
    <Form onSubmit={readMore}>
      <FormGroup>
        <InputGroup className={this.props.lines === this.state.lines ? 'hidden' : ''}>
          <FormControl type='number' defaultValue={10} ref={(ref: HTMLInputElement) => { readMoreLinesRef = ref; }} />
          <InputGroup.Button><Button type='submit'>lines</Button></InputGroup.Button>
        </InputGroup>
        <Button block className={this.props.bytes === this.state.bytes ? 'hidden' : ''} onClick={readAll}>read all</Button>
      </FormGroup>
    </Form>
    <Well bsSize='small'>
    <Row>
      <Col xs={3}>{this.state.bytes}/{this.props.bytes} bytes</Col>
      <Col xs={3}>{this.state.chars}/{this.props.chars} chars</Col>
      <Col xs={3}>{this.state.words}/{this.props.words} words</Col>
      <Col xs={3}>{this.state.lines}/{this.props.lines} lines</Col>
    </Row>
    </Well>
    </div>;
  }

  private readMore(lines: number): void {
    this.props.readMore(this.props.seq, this.state.bytes, lines).then((result: IMoreResult) => {
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
