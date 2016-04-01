import * as React from 'react';
import Connection from './connection.ts';
import { Input } from 'react-bootstrap';

class Path extends React.Component<{}, {}> {
  constructor(props: {}) {
    super(props);
  }

  public render(): JSX.Element {
    return <Input type='text' value={this.props.children} readOnly />;
  }
}

interface IProps {
  connection: Connection;
  seq: IterableIterator<number>;
}

interface IState {
  path?: string;
}

export default class FileBrowser extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {};
    const seq = this.props.seq.next().value;
    const key = this.props.connection.key;
    props.connection.send({seq, key, type: 'pwd'}).then((result: {pwd: string}) => {
      const path = result.pwd;
      this.setState({ path });
      return path;
    });
  }

  public render(): JSX.Element {
    return (
      <div className='file-browser'>
      <Path>{this.state.path}</Path>
      </div>
    );
  }
}
