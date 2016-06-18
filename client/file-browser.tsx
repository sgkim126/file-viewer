import * as React from 'react';
import './file-browser.styl';
import Dir from './dir.tsx';
import IBrowser from './ibrowser.ts';
import ICommandOption from './icommandoption.ts';
import IFile from './ifile.ts';
import IResult from './iresult.ts';
import ISelected from './iselected.ts';
import FailureResultButton from './failureresultbutton.tsx';
import PendingResultButton from './pendingresultbutton.tsx';
import SuccessResultButton from './successresultbutton.tsx';
import { Col, ListGroup, ListGroupItem } from 'react-bootstrap';

interface IProps {
  ls: (path: string) => Promise<IBrowser>;
  root: string;
  rootFiles: IFile[];

  columns: Map<string, IFile[]>[];
  closeDir: (column: number, path: string) => void;

  results: IResult[];
  resultSeq: number;

  clearSelects: (e: React.MouseEvent) => void;
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

    const { selecteds, closeDir, onSelect } = this.props;

    const columns = this.props.columns.map((column: Map<string, IFile[]>, key: number) => {
      let row: JSX.Element[] = [];
      for (const [path, files] of column) {
        row.push(<Dir key={path} column={key} path={path} files={files} onSelect={onSelect} selecteds={selecteds} closeDir={closeDir}/>);
      }
      const position = 'absolute';
      const left = ((key + 1) * 200) + 15 + 'px';
      return <div key={key} className='column' style={{ position, left }}>{row}</div>;
    });

    const results = this.props.results.map((result: IResult, key: number) => {
      const { failure, success, pending } = result;
      if (success) {
        const title = success.shortCommand;
        const name = success.shortCommand;
        const pipe = success.seq;
        const seq = success.seq;
        const { selecteds, resultSeq, onSelect } = this.props;
        const props = { seq, name, title, pipe, selecteds, resultSeq, onSelect };
        return <SuccessResultButton key={result.seq} {...props} />;
      } else if (pending) {
        const seq = pending.seq;
        const title = pending.command;
        const name = pending.command;
        const { onSelect } = this.props;
        const props = { seq, title, name, onSelect };
        return <PendingResultButton key={result.seq} {...props} />;
      } else if (failure) {
        const seq = failure.seq;
        const title = failure.shortCommand;
        const name = failure.shortCommand;
        const { onSelect } = this.props;
        const props = { seq, title, name, onSelect };
        return <FailureResultButton key={result.seq} {...props} />;
      }
      return undefined;
    });

    return <div className='file-browser' onClick={this.props.clearSelects}>
      <Col xs={9} className='file-browser-inner'>
        <div className='column'>
          <Dir column={-1} path={this.props.root} files={this.props.rootFiles} open={true} onSelect={onSelect} foldable={false} selecteds={selecteds}/>
        </div>
        {columns}
      </Col>
      <Col xs={3}><ListGroup>{results}</ListGroup></Col>
    </div>;
  }
}

function joinPath(dirpath: string, filename: string): string {
  return `${this.props.path}/${filename}`;
}
