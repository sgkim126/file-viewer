import './result.styl';
import * as React from 'react';
import IFailure from './ifailure.ts';
import { Well } from 'react-bootstrap';

interface IProps extends IFailure {
  hide: boolean;
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
    <Well>Error</Well>
    <pre>{error}</pre>
    </div>;
  }
}
