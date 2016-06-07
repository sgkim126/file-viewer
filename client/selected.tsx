import './selected.styl';
import * as React from 'react';
import { DragSource, DropTarget, DropTargetMonitor } from 'react-dnd';
import { findDOMNode } from 'react-dom';

interface IProps {
  name: string;
  title: string;
  index: number;

  move: (dragIndex: number, hoverIndex: number) => void;

  connectDragSource?: (a: JSX.Element) => JSX.Element;
  connectDropTarget?: (a: JSX.Element) => JSX.Element;
  isDragging?: boolean;
}

interface IState {
}

const selectedSource = {
  beginDrag(props: IProps) {
    return {
      index: props.index
    };
  }
};

const selectedTarget = {
  hover(props: IProps, monitor: DropTargetMonitor, component: Selected) {
    const dragIndex = (monitor.getItem() as { index: number }).index;
    const hoverIndex = props.index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Determine rectangle on screen
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

    // Determine mouse position
    const clientOffset = monitor.getClientOffset();

    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%

    // Dragging downwards
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return;
    }

    // Dragging upwards
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return;
    }

    // Time to actually perform the action
    props.move(dragIndex, hoverIndex);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    (monitor.getItem() as { index: number }).index = hoverIndex;
  }
};

@DropTarget('selected-drag', selectedTarget, connect => ({
  connectDropTarget: connect.dropTarget()
}))
@DragSource('selected-drag', selectedSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))
export default class Selected extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  render(): JSX.Element {
    const { name, title, isDragging, connectDragSource, connectDropTarget } = this.props;
    const opacity = isDragging ? 0 : 2;

    return connectDragSource(connectDropTarget(<span className='selected' style={{ opacity }} title={title}>{name}</span>));
  }
}
