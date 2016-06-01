import * as React from 'react';
import './file-browser.styl';
import Commander from './commander.tsx';
import Dir from './dir.tsx';
import File from './file.tsx';
import IBrowser from './ibrowser.ts';
import IFile from './ifile.ts';
import ISelected from './iselected.ts';
import IMenu from './imenu.ts';
import Menu from './menu.tsx';
import CommandOption from './options.ts';
import { Button, ButtonGroup, Col } from 'react-bootstrap';
import { ICommandInput } from './messages.ts';

interface IProps {
  onClick: (e: React.MouseEvent, path: string, isFIle: boolean) => void;
  onCommand: (command: string, input: ICommandInput, option: CommandOption) => void;
  ls: (path: string) => Promise<IBrowser>;
  root: string;
  rootFiles: IFile[];
}

interface IState {
  columns?: Map<string, IFile[]>[];
  selected?: ISelected;
}

export default class FileBrowser extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      columns: [],
    };
  }

  public render(): JSX.Element {
    let selectedFile = { } as any;

    const openDir = (path: string, columnNumber: number): void => {
      this.props.ls(path).then(({ files }: IBrowser) => {
        const columns = this.state.columns;
        const column = (columns.length === columnNumber)
          ? new Map<string, IFile[]>()
          : columns[columnNumber];

        if (!column.has(path)) {
          column.set(path, files);
          columns[columnNumber] = column;
          this.setState({ columns });
        }
      });
    };

    const onSelect = (path: string, column: number, is_dir: boolean): void => {
      const selected = { path, column, is_dir };
      this.setState({ selected });
    };

    const columns = this.state.columns.map((column: Map<string, IFile[]>, key: number) => {
      let row: JSX.Element[] = [];
      for (const [path, files] of column) {
        row.push(<Dir key={path} column={key} path={path} files={files} onSelect={onSelect}/>);
      }
      return <div key={key} className='column'>{row}</div>;
    });

    return <div className='file-browser'>
      <Commander openDir={openDir} selected={this.state.selected} onCommand={this.props.onCommand}/>
      <div className='file-browser-inner'>
        <div className='column'>
          <Dir column={-1} path={this.props.root} files={this.props.rootFiles} open={true} onSelect={onSelect} foldable={false}/>
        </div>
        {columns}
      </div>
    </div>;
  }
}

function joinPath(dirpath: string, filename: string): string {
  return `${this.props.path}/${filename}`;
}
