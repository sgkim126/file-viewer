import './selecteds.styl';
import * as React from 'react';
import ISelected from './iselected.ts';
import { Button, Glyphicon } from 'react-bootstrap';

interface IProps {
  selecteds: ISelected[];

  setSelecteds: (selecteds: ISelected[]) => void;
}

interface IState {
}

export default class Selecteds extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  public render(): JSX.Element {
    const selecteds = this.props.selecteds.map((selected: ISelected, i: number): JSX.Element[] => {
      const { name, title } = selected;
      const onClick = () => {
        this.swap(i - 1, i);
      };
      const prevButton = i === 0 ? undefined : <Button bsSize='small' onClick={onClick}><Glyphicon glyph='transfer' /></Button>;
      const glyph = <Glyphicon glyph={selected.is_dir ? 'folder-open' : 'file'} />;
      return [prevButton, <span className='selected' key={title} title={title}>{glyph}&nbsp;&nbsp;{name}</span>];
    });
    return <div className='selecteds'>{selecteds}</div>;
  }

  private swap(i1: number, i2: number): void {
    const { selecteds } = this.props;
    const s1 = selecteds[i1];
    const s2 = selecteds[i2];
    selecteds[i2] = s1;
    selecteds[i1] = s2;

    this.props.setSelecteds(selecteds);
  }
}
