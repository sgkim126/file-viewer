import './dir.styl';
import * as React from 'react';
import IFile from './ifile.ts';
import ISelected from './iselected.ts';
import { Button, ButtonToolbar, ButtonGroup, Col, Glyphicon, ListGroup, ListGroupItem, Panel, Row } from 'react-bootstrap';

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
  open?: boolean;
  page?: number;
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
      page: 1,
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
    const { page } = this.state;

    const closeButton = closeDir ? <Button className='dir-close' onClick={onClose}><Glyphicon glyph='remove' /></Button> : undefined;
    const header = <span>{basename(path)}{closeButton}</span>;

    const clickLeftPage = (e: React.MouseEvent) => {
      e.stopPropagation();
      this.setState({ page: page - 1 });
    };
    const clickRightPage = (e: React.MouseEvent) => {
      e.stopPropagation();
      this.setState({ page: page + 1 });
    };

    const leftArrowDisabled = page === 1;
    const rightArrowDisabled = page * 5 >= files.length;
    const numberPerPage = 5;

    return <Panel collapsible={foldable} defaultExpanded={open} header={header} key={path} title={path}>
      <ListGroup fill>
        {files.slice((page - 1) * numberPerPage, (page) * numberPerPage).map((file: IFile) => {
          const glyph = <Glyphicon glyph={file.is_dir ? 'folder-open' : 'file'} />;
          const active = !!selecteds.find(({input}: ISelected) => input.file === this.path(file.name));
          return <ListGroupItem active={active} key={file.name} onClick={(e) => onClick(e, file)}>{glyph}&nbsp;&nbsp;{file.name}</ListGroupItem>;
        })}
        <ListGroupItem>
          <ButtonToolbar>
            <Button onClick={clickLeftPage} bsSize='small' className='pull-left' disabled={leftArrowDisabled}><Glyphicon glyph='arrow-left' /></Button>
            <Button onClick={clickRightPage} bsSize='small' className='pull-right' disabled={rightArrowDisabled}><Glyphicon glyph='arrow-right' /></Button>
          </ButtonToolbar>
        </ListGroupItem>
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
