import * as React from 'react';
import Panel from './panel.tsx';
import { Col } from 'react-bootstrap';
const Draggable = require('react-draggable');

interface IProps {
  id: number;
  command: string;
  lines: string[];
}

export default class Preview extends React.Component<IProps, {}> {
  constructor(props: IProps) {
    super(props);
  }

  public render(): JSX.Element {
    return <Panel title={this.props.command}>
    <pre>{this.props.lines.join('\n')}</pre>
    </Panel>;
  }
}
