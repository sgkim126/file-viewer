import * as React from 'react';
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
    return <Draggable handle='.handle'>
      <div className='preview'>
      <Col xs={12} className='handle'>TITLE BAR</Col>
      <Col xs={12}>{this.props.lines.join('<br />')}</Col>
      </div>
    </Draggable>;
  }
}
