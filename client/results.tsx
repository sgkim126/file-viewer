import * as React from 'react';
import IMoreResult from './imoreresult.ts';
import IResult from './iresult.ts';
import FailureResult from './failureresult.tsx';
import SuccessResult from './successresult.tsx';

interface IProps {
  results: IResult[];
  readMore: (id: number, start: number, lines: number) => Promise<IMoreResult>;
  show: number;
}

interface IState {
}

export default class Results extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  public render(): JSX.Element {
    const results = this.props.results.map((result: IResult) => {
      const hide = result.seq !== this.props.show;
      const { failure, success } = result;
      if (success) {
        return <SuccessResult key={result.seq} {...success} hide={hide} readMore={this.props.readMore} />;
      } else if (failure) {
        return <FailureResult key={result.seq} {...failure} hide={hide} />;
      }

    });
    return <div className='full-height'>{results}</div>;
  }

  private componentWillMount() {
    this.setState({});
  }
}
