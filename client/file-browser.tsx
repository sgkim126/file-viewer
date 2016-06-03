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

  columns: Map<string, IFile[]>[];
  openDir: (path: string, columnNumber: number) => void;
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

      const selecteds = this.state.selecteds.filter(({ path }: ISelected) => { return path !== selected.path; });
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

    return <div className='file-browser'>
      <Commander openDir={this.props.openDir} selecteds={selecteds} onCommand={this.props.onCommand}/>
      <div className='file-browser-inner'>
        <div className='column'>
          <Dir column={-1} path={this.props.root} files={this.props.rootFiles} open={true} onSelect={onSelect} foldable={false} selecteds={selecteds}/>
        </div>
        {columns}
      </div>
    </div>;
  }
}

function joinPath(dirpath: string, filename: string): string {
  return `${this.props.path}/${filename}`;
}
