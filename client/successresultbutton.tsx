import * as React from 'react';
import ISelected from './iselected.ts';
import { ListGroupItem } from 'react-bootstrap';

interface IProps {
  seq: number;
  title: string;
  name: string;
  pipe: number;

  selecteds?: ISelected[];
  resultSeq: number;

  onSelect: (e: React.MouseEvent, selected: ISelected) => void;
}
interface IState {
}

export default class SuccessResultButton extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  public render(): JSX.Element {
    const { seq, title, name, pipe, selecteds, resultSeq, onSelect } = this.props;
    const onClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      onSelect(e, { input: { pipe }, resultSeq: seq });
    };
    const active = !!selecteds.find((selected: ISelected) => selected.resultSeq === resultSeq);
    const bsStyle = seq === resultSeq ? 'info' : undefined;
    return <ListGroupItem active={active} bsStyle={bsStyle} key={seq} onClick={onClick} title={title}>{name}</ListGroupItem>;
  }
}
