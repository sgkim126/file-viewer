import * as React from 'react';
import Panel from './panel.tsx';
import { Col } from 'react-bootstrap';
const Draggable = require('react-draggable');

interface IProps {
  lines: string[];
}

export default class Preview extends React.Component<IProps, {}> {
  constructor(props: IProps) {
    super(props);
  }

  public render(): JSX.Element {
    return <Panel title='TITLE BAR'>
      <Col xs={12}>{this.props.lines.join("\n")}</Col>
    </Panel>;
  }
}
