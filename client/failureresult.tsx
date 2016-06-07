import './result.styl';
import * as React from 'react';
import IFailure from './ifailure.ts';
import { Button, Col, Glyphicon, Row, Well } from 'react-bootstrap';

interface IProps extends IFailure {
  hide: boolean;

  closeResult: (seq: number) => void;
}

interface IState {
}

export default class FailureResult extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  public render(): JSX.Element {
    let className = 'full-height result';
    if (this.props.hide) {
      className += ' hidden';
    }

    const error = this.props.error ? this.props.error : this.props.errors.join('\n');
    const closeResult = () => this.props.closeResult(this.props.seq);

    return <div className={className}>
    <Well>Error<Button className='close-result' onClick={closeResult}><Glyphicon glyph='remove' /></Button></Well>
    <pre>{error}</pre>
    </div>;
  }
}
