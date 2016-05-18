import * as React from 'react';
const { FormControl, FormGroup } = require('react-bootstrap');

interface IProps {
  changeDir: (path: string) => void;
}

interface IState {
  changing?: boolean;
  path?: string;
}

export default class Path extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      changing: false,
      path: this.props.children as string,
    };
  }

  public render(): JSX.Element {
    return <form onSubmit={this.onSubmit.bind(this)}>
    <FormGroup><FormControl type='text' readOnly={this.state.changing} placeholder={this.props.children} value={this.state.path} onChange={this.onChange.bind(this)} onBlur={this.onBlur.bind(this)} />
    </FormGroup></form>;
  }

  private componentWillReceiveProps(props: IProps) {
    const path = (props as any).children as string;
    if (this.props.children !== path) {
      this.setState({
        changing: false,
        path,
      });
    }
  }

  private onChange(e: React.FormEvent): void {
    let target = e.target as HTMLInputElement;
    this.setState({
      path: target.value,
    });
  }

  private onBlur(e: React.FocusEvent): void {
    if (this.state.changing) {
      return;
    }

    this.setState({
      path: this.props.children as string,
    });
  }

  private onSubmit(e: React.FormEvent): void {
    e.preventDefault();
    if (this.props.children !== this.state.path) {
      this.setState({changing: true});
      this.props.changeDir(this.state.path);
    }
  }
}
