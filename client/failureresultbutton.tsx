import * as React from 'react';
import ISelected from './iselected.ts';
import { ListGroupItem } from 'react-bootstrap';

interface IProps {
  seq: number;
  title: string;
  name: string;

  onSelect: (e: React.MouseEvent, selected: ISelected) => void;
}
interface IState {
}

export default class FailureResultButton extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  public render(): JSX.Element {
    const { seq, title, name, onSelect } = this.props;
    const onClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      onSelect(e, { input: { }, resultSeq: seq });
    };
    return <ListGroupItem bsStyle='danger' key={seq} onClick={onClick} title={title}>{name}</ListGroupItem>;
  }
}
