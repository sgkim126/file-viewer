const HTML5Backend = require('react-dnd-html5-backend');
const update = require('react/lib/update');
const { DragDropContext } = require('react-dnd');
import * as React from 'react';
import Selected from './selected.tsx';
import ISelected from './iselected.ts';

interface IProps {
  selecteds: ISelected[];

  setSelecteds: (selecteds: ISelected[]) => void;
}

interface IState {
}

@DragDropContext(HTML5Backend)
export default class Selecteds extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  public render(): JSX.Element {
    return <div className='selecteds'>
      {this.props.selecteds.map((selected: ISelected, i: number) => {
        const { name, title } = selected;
        return <Selected key={title} title={title} index={i} move={this.move.bind(this)} name={name} />;
      })}
    </div>;
  }

  private move(dragIndex: number, hoverIndex: number): void {
    const { selecteds } = this.props;
    const drag = selecteds[dragIndex];

    console.log(update(selecteds, {
      $splice: [
        [dragIndex, 1],
        [hoverIndex, 0, drag]
      ]
    }));

    this.props.setSelecteds(update(selecteds, {
      $splice: [
        [dragIndex, 1],
        [hoverIndex, 0, drag]
      ]
    }));

  }
}
