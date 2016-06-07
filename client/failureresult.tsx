import './result.styl';
import * as React from 'react';
import IFailure from './ifailure.ts';
import { Button, Col, Glyphicon, Well } from 'react-bootstrap';

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

    return <div className={className}>
    <Well><Col xs={11}>Error</Col><Col xs={1}><Button onClick={this.props.closeResult}><Glyphicon glyph='close' /></Button></Col></Well>
    <pre>{error}</pre>
    </div>;
  }
}
