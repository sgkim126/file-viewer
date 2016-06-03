const { Collapse } = require('react-bootstrap');
import * as React from 'react';
import IFile from './ifile.ts';
import ISelected from './iselected.ts';
import { Button, ButtonGroup, Glyphicon, ListGroup, ListGroupItem } from 'react-bootstrap';

interface IProps {
  column: number;
  path: string;
  files: IFile[];
  open?: boolean;
  foldable?: boolean;
  selecteds?: ISelected[];

  onSelect: (e: React.MouseEvent, selected: ISelected) => void;
}

interface IState {
  open: boolean;
}

export default class Dir extends React.Component<IProps, IState> {
  private static defaultProps = {
    open: true,
    foldable: true,
  };
  constructor(props: IProps) {
    super(props);

    this.state = {
      open: this.props.open,
    };
  }

  public render(): JSX.Element {
    const onCollapse = (e: React.MouseEvent) => {
      const open = !this.state.open || !this.props.foldable;
      this.setState({ open, });
    };

    const onSelect = (e: React.MouseEvent, file: IFile) => {
      e.stopPropagation();
      const column = this.props.column;
      const path = this.path(file.name);
      const is_dir = file.is_dir;
      this.props.onSelect(e, { column, path, is_dir });
    };

    const onClick = (e: React.MouseEvent, file: IFile) => {
      e.stopPropagation();
      onSelect(e, file);
    };

    return <div key={this.props.path}>
      <div title={this.props.path} onClick={onCollapse}>{basename(this.props.path)}</div>
      <Collapse in={this.state.open}>
      <ListGroup>
        {this.props.files.map((file: IFile) => {
          const glyph = <Glyphicon glyph={file.is_dir ? 'folder-open' : 'file'} />;
          const active = this.isSelected(this.path(file.name));
          return <ListGroupItem active={active} key={file.name} onClick={(e) => onClick(e, file)}>{glyph} {file.name}</ListGroupItem>;
        })}
      </ListGroup>
      </Collapse>
    </div>;
  }

  private path(filename: string): string {
    return `${this.props.path}/${filename}`;
  }

  private isSelected(targetPath: string): boolean {
    for (const { path } of this.props.selecteds) {
      if (targetPath === path) {
        return true;
      }
    }
    return false;
  }
}

function basename(path: string): string {
  return path.split('/').reverse()[0];
}
