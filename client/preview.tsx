import * as React from 'react';
import IPreview from './ipreview.ts';
import Panel from './panel.tsx';
import { Col } from 'react-bootstrap';
const Draggable = require('react-draggable');

interface IProps extends IPreview {
  onClose: (id: number) => {};
}

export default class Preview extends React.Component<IProps, {}> {
  constructor(props: IProps) {
    super(props);
  }

  public render(): JSX.Element {
    return <Panel title={this.props.command} onClose={() => { this.props.onClose(this.props.id); }}>
    <pre>{this.props.lines.join('\n')}</pre>
    </Panel>;
  }
}
