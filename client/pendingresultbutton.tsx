import * as React from 'react';
import ISelected from './iselected.ts';
import { ListGroupItem } from 'react-bootstrap';

interface IProps {
  seq: number;
  title: string;
  name: string;
}
interface IState {
}

export default class PendingResultButton extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  public render(): JSX.Element {
    const { seq, title, name } = this.props;
    const onClick = (e: React.MouseEvent) => {
      e.stopPropagation();
    };
    return <ListGroupItem bsStyle='warning' key={seq} onClick={onClick} title={title}>{name}</ListGroupItem>;
  }
}
