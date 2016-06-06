import * as React from 'react';
import './file-browser.styl';
import Dir from './dir.tsx';
import IBrowser from './ibrowser.ts';
import ICommandOption from './icommandoption.ts';
import IFile from './ifile.ts';
import IResult from './iresult.ts';
import ISelected from './iselected.ts';
import { Col, ListGroup, ListGroupItem } from 'react-bootstrap';

interface IProps {
  ls: (path: string) => Promise<IBrowser>;
  root: string;
  rootFiles: IFile[];

  columns: Map<string, IFile[]>[];

  results: IResult[];
  resultSeq: number;

  clearSelects: () => void;
  onSelect: (e: React.MouseEvent, selected: ISelected) => void;
  selecteds?: ISelected[];
}

interface IState {
}

export default class FileBrowser extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
    };
  }

  public render(): JSX.Element {
    let selectedFile = { } as any;

    const selecteds = this.props.selecteds;

    const onSelect = this.props.onSelect;
    const columns = this.props.columns.map((column: Map<string, IFile[]>, key: number) => {
      let row: JSX.Element[] = [];
      for (const [path, files] of column) {
        row.push(<Dir key={path} column={key} path={path} files={files} onSelect={onSelect} selecteds={selecteds}/>);
      }
      return <div key={key} className='column'>{row}</div>;
    });

    const results = this.props.results.map((result: IResult, key: number) => {
      const onClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onSelect(e, { input: { pipe: result.id }, resultSeq: result.seq });
      };
      const active = !!this.props.selecteds.find(({input}: ISelected) => input.pipe === result.id);
      const bsStyle =  result.seq === this.props.resultSeq ? 'info' : undefined;
      return <ListGroupItem active={active} bsStyle={bsStyle} key={result.id} onClick={onClick} title={result.command}>{result.name}</ListGroupItem>;
    });

    return <div className='file-browser' onClick={this.props.clearSelects}>
      <Col xs={8} className='file-browser-inner'>
        <div className='column'>
          <Dir column={-1} path={this.props.root} files={this.props.rootFiles} open={true} onSelect={onSelect} foldable={false} selecteds={selecteds}/>
        </div>
        {columns}
      </Col>
      <Col xs={4}><ListGroup>{results}</ListGroup></Col>
    </div>;
  }
}

function joinPath(dirpath: string, filename: string): string {
  return `${this.props.path}/${filename}`;
}
