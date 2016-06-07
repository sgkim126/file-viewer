import './dir.styl';
import * as React from 'react';
import IFile from './ifile.ts';
import ISelected from './iselected.ts';
import { Button, Col, Glyphicon, ListGroup, ListGroupItem, Panel, Row } from 'react-bootstrap';

interface IProps {
  column: number;
  path: string;
  files: IFile[];
  open?: boolean;
  foldable?: boolean;
  selecteds?: ISelected[];

  closeDir?: (column: number, path: string) => void;
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
    const onSelect = (e: React.MouseEvent, file: IFile) => {
      e.stopPropagation();
      const column = this.props.column;
      const path = this.path(file.name);
      const is_dir = file.is_dir;
      const name = file.name;
      const title = path;
      this.props.onSelect(e, { column, input: { file: path } , is_dir, name, title });
    };

    const onClick = (e: React.MouseEvent, file: IFile) => {
      e.stopPropagation();
      onSelect(e, file);
    };

    const { files, selecteds, column, path, open, foldable, closeDir } = this.props;
    const onClose = () => closeDir(column, path);

    const closeButton = closeDir ? <Button className='dir-close' onClick={onClose}><Glyphicon glyph='remove' /></Button> : undefined;
    const header = <span>{basename(path)}{closeButton}</span>;
    return <Panel collapsible={foldable} defaultExpanded={open} header={header} key={path} title={path}>
      <ListGroup fill>
        {files.map((file: IFile) => {
          const glyph = <Glyphicon glyph={file.is_dir ? 'folder-open' : 'file'} />;
          const active = !!selecteds.find(({input}: ISelected) => input.file === this.path(file.name));
          return <ListGroupItem active={active} key={file.name} onClick={(e) => onClick(e, file)}>{glyph}&nbsp;&nbsp;{file.name}</ListGroupItem>;
        })}
      </ListGroup>
    </Panel>;
  }

  private path(filename: string): string {
    return `${this.props.path}/${filename}`;
  }
}

function basename(path: string): string {
  return path.split('/').reverse()[0];
}
