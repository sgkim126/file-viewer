import * as React from 'react';
import File from './file.tsx';
import FileInfo from './file-info.tsx';
import IFile from './ifile.ts';
import IMenu from './imenu.ts';
import Menu from './menu.tsx';
import CommandOption from './options.ts';
import Panel from './panel.tsx';
import Path from './path.tsx';
import { Col } from 'react-bootstrap';
import { ICommandInput } from './messages.ts';

interface IProps {
  path: string;
  files: IFile[];
  onClick: (e: React.MouseEvent, path: string, isFIle: boolean) => void;
  onCommand: (command: string, input: ICommandInput, option: CommandOption) => void;
  changeDir: (path: string) => void;
  home: string;
}

interface IState {
  selected?: number;
  position?: {
    x?: number,
    y?: number,
  };
  menu?: IMenu;
}

export default class FileBrowser extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      position: {
        x: 0,
        y: 0,
      },
      menu: null,
    };
  }

  public render(): JSX.Element {
    let files = <div>'Loading...'</div> as any;
    let selectedFile = { } as any;
    const onContextMenu = (eventX: number, eventY: number, file: IFile) => {
      const x = eventX - this.state.position.x;
      const y = eventY - this.state.position.y;
      const menu = {x, y, file};
      this.setState({ menu });
    };
    if (this.props.files) {
      files = this.props.files.map((file: IFile, key: number) => {
        if (key === this.state.selected) {
          selectedFile = file;
        }
        const selected = key === this.state.selected;
        return <File
          dirpath={this.props.path}
          selected={selected}
          key={key}
          {...file}
          onContextMenu={onContextMenu}
          onClick={(e: React.MouseEvent) => this.props.onClick(e, `${this.props.path}/${file.name}`, file.is_file)}
        />;
      });
    }
    const menu = this.state.menu ? this.menu() : <div></div>;
    return <Panel title='files' onStop={this.onStop.bind(this)}>
      <Path changeDir={this.changeDir.bind(this)} home={this.props.home}>{this.props.path}</Path>
      <Col xs={8} className='file-browser'>
        {files}
      </Col>
      <Col xs={4}>
        <FileInfo {...selectedFile} />
      </Col>
      {menu}
    </Panel>;
  }

  private menu(): JSX.Element {
    const onCommand = (command: string, input: ICommandInput, option: CommandOption) => {
      this.props.onCommand(command, input, option);
      this.setState({ menu: null });
    };

    return <Menu {...this.state.menu}
      currentPath={this.props.path}
      onCommand={onCommand}
      changeDir={(filename: string) => this.changeDir(this.path(filename))}
    />;
  }

  private changeDir(path: string): void {
    this.setState({ menu: null });
    this.props.changeDir(path);
  }

  private path(filename: string): string {
    return `${this.props.path}/${filename}`;
  }

  private onStop(e: React.MouseEvent, position: { x: number, y: number }): void {
    this.setState({ position });
  }
}
