import * as React from 'react';
import IMoreResult from './imoreresult.ts';
import IResult from './iresult.ts';
import Result from './result.tsx';

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
      const hide = result.id !== this.props.show;
      return <Result key={result.id} {...result} hide={hide} readMore={this.props.readMore} />;
    });
    return <div className='full-height'>{results}</div>;
  }

  private componentWillMount() {
    this.setState({});
  }
}
