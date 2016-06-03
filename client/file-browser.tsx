import * as React from 'react';
import './file-browser.styl';
import Commander from './commander.tsx';
import Dir from './dir.tsx';
import IBrowser from './ibrowser.ts';
import IFile from './ifile.ts';
import ISelected from './iselected.ts';
import IResult from './iresult.ts';
import CommandOption from './options.ts';
import { Col, ListGroup, ListGroupItem, Row } from 'react-bootstrap';
import { ICommandInput } from './messages.ts';

interface IProps {
  onClick: (e: React.MouseEvent, path: string, isFIle: boolean) => void;
  onCommand: (command: string, input: ICommandInput, option: CommandOption) => void;
  ls: (path: string) => Promise<IBrowser>;
  root: string;
  rootFiles: IFile[];

  columns: Map<string, IFile[]>[];
  openDir: (path: string, columnNumber: number) => void;

  results: IResult[];
  resultId: number;
  showResult: (resultId: number) => void;
}

interface IState {
  selecteds?: ISelected[];
}

export default class FileBrowser extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      selecteds: [],
    };
  }

  public render(): JSX.Element {
    let selectedFile = { } as any;

    const onSelect = (e: React.MouseEvent, selected: ISelected): void => {
      if (!e.ctrlKey) {
        this.setState({ selecteds: [ selected ] });
        return;
      }

      const selecteds = this.state.selecteds.filter(({ input }: ISelected) => {
        return input.file !== selected.input.file || input.pipe !== selected.input.pipe;
      });
      if (selecteds.length === this.state.selecteds.length) {
        selecteds.push(selected);
      }
      this.setState({ selecteds });
    };

    const selecteds = this.state.selecteds;

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
        if (e.altKey) {
          const resultId = result.id;
          this.props.showResult(resultId);
          return;
        }
        onSelect(e, { input: { pipe: result.id }});
      };
      const active = !!this.state.selecteds.find(({input}: ISelected) => input.pipe === result.id);
      return <ListGroupItem active={active} key={result.id} onClick={onClick} title={result.command}>{result.name}</ListGroupItem>;
    });

    const onClick = () => {
      this.setState({ selecteds: [] });
    };
    return <div className='file-browser' onClick={onClick}>
    <Row>
      <Commander openDir={this.props.openDir} selecteds={selecteds} onCommand={this.props.onCommand}/>
    </Row>
    <Row>
      <Col xs={8} className='file-browser-inner'>
        <div className='column'>
          <Dir column={-1} path={this.props.root} files={this.props.rootFiles} open={true} onSelect={onSelect} foldable={false} selecteds={selecteds}/>
        </div>
        {columns}
      </Col>
      <Col xs={4}><ListGroup>{results}</ListGroup></Col>
    </Row>
    </div>;
  }
}

function joinPath(dirpath: string, filename: string): string {
  return `${this.props.path}/${filename}`;
}
