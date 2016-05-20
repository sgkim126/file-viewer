const Draggable = require('react-draggable');
import './panel.styl';
import * as React from 'react';
import { Button, Glyphicon } from 'react-bootstrap';

interface IProps {
  title: string;
  width?: string;
  height?: string;
  onClose?: () => void;
}

export default class Panel extends React.Component<IProps, {}> {
  private static defaultProps: IProps = {
    title: '',
    width: '30%',
    height: '50%',
  };

  constructor(props: IProps) {
    super(props);
  }

  public render(): JSX.Element {
    const style = `width:${this.props.width}; height:${this.props.height};`;
    const buttons: JSX.Element[] = [];
    if (this.props.onClose) {
      buttons.push(<Button onClick={this.props.onClose} bsClass='pull-right'><Glyphicon glyph='remove' /></Button>);
    }
    return <Draggable handle='.handle'>
    <div className='panel' style={style}>
    <div className='handle'><span className='handle'>{this.props.title}</span>{buttons}</div>
    <div className='panel-inner'>{this.props.children}</div>
    </div>
    </Draggable>;
  }
}
