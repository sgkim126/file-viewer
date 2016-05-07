const Draggable = require('react-draggable');
import './panel.styl';
import * as React from 'react';

interface IProps {
  title: string;
  width?: string;
  height?: string;
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
    return <Draggable handle='.handle'>
    <div className='panel' style={style}>
    <div className='handle'>{this.props.title}</div>
    <div className='panel-inner'>{this.props.children}</div>
    </div>
    </Draggable>;
  }
}
