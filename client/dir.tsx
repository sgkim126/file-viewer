const { Collapse } = require('react-bootstrap');
import * as React from 'react';
import IFile from './ifile.ts';
import { Button, ButtonGroup, Glyphicon, ListGroup, ListGroupItem } from 'react-bootstrap';

interface IProps {
  column: number;
  path: string;
  files: IFile[];
  open?: boolean;
  foldable?: boolean;

  onSelect: (path: string, column: number, is_dir: boolean) => void;
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
    const onCollapse = () => {
      const open = !this.state.open || !this.props.foldable;
      this.setState({ open, });
    };

    const onSelect = (e: React.MouseEvent, file: IFile) => {
      this.props.onSelect(this.path(file.name), this.props.column + 1, file.is_dir);
    };

    return <div key={this.props.path}>
      <div title={this.props.path} onClick={onCollapse}>{basename(this.props.path)}</div>
      <Collapse in={this.state.open}>
      <ListGroup>
        {this.props.files.map((file: IFile) => {
          const glyph = <Glyphicon glyph={file.is_dir ? 'folder-open' : 'file'} />;
          return <ListGroupItem key={file.name} onClick={(e) => { onSelect(e, file) }}>{glyph} {file.name}</ListGroupItem>;
        })}
      </ListGroup>
      </Collapse>
    </div>;
  }

  private path(filename: string): string {
    return `${this.props.path}/${filename}`;
  }
}

function basename(path: string): string {
  return path.split('/').reverse()[0];
}
