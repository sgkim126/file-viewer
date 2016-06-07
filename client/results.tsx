import * as React from 'react';
import IMoreResult from './imoreresult.ts';
import IResult from './iresult.ts';
import FailureResult from './failureresult.tsx';
import SuccessResult from './successresult.tsx';

interface IProps {
  results: IResult[];
  readMore: (id: number, start: number, lines: number) => Promise<IMoreResult>;
  show: number;

  closeResult: (seq: number) => void;
}

interface IState {
}

export default class Results extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  public render(): JSX.Element {
    const { closeResult } = this.props;
    const results = this.props.results.map((result: IResult) => {
      const hide = result.seq !== this.props.show;
      const { failure, success } = result;
      if (success) {
        return <SuccessResult key={result.seq} {...success} hide={hide} readMore={this.props.readMore} closeResult={closeResult}/>;
      } else if (failure) {
        return <FailureResult key={result.seq} {...failure} hide={hide} closeResult={closeResult}/>;
      }

    });
    return <div className='full-height'>{results}</div>;
  }

  private componentWillMount() {
    this.setState({});
  }
}
