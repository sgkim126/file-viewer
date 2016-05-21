import * as React from 'react';
import * as ReactDOM from 'react-dom';
import CommandOption from './options.ts';
import Connection from './connection.ts';
import FileBrowser from './file-browser.tsx';
import IFile from './ifile.ts';
import IPreview from './ipreview.ts';
import Message from './messages.ts';
import Preview from './preview.tsx';
import SeqGenerator from './seq-generator.ts';
import { Grid, Row, Col } from 'react-bootstrap';
import { ICommandInput } from './messages.ts';

interface IProps {
  connection: Connection;
  seq: IterableIterator<number>;
  home: string;
}

interface IBrowser {
  path: string;
  files: IFile[];
}

interface IState {
  browser?: IBrowser;
  previews?: IPreview[];
}

class Main extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = { previews: [] };

    this.ls(this.props.home).then((browser: IBrowser) => {
      this.setState({ browser });
    });
  }

  public render(): JSX.Element {
    const panels: JSX.Element[] = [];
    if (this.state.browser) {
      const { path, files } = this.state.browser;
      const onCommand = (command: string, input: ICommandInput, option: CommandOption) => {
        const seq = this.props.seq.next().value;
        const key = this.props.connection.key;
        const message: Message = { seq, key, type: 'command', command, input, option };
        const result = this.props.connection.send(message).then((preview: IPreview) => {
          const previews = this.state.previews.slice();
          previews.push(preview);
          this.setState({ previews });
        });
      };
      const changeDir = (path: string) => {
        this.ls(path)
        .then((browser: IBrowser) => {
          this.setState({ browser });
        });
      };
      panels.push(<FileBrowser files={files} path={path} home={this.props.home} onCommand={onCommand} changeDir={changeDir} onClick={(e: React.MouseEvent, path: string, isFile: boolean) => {
      }}></FileBrowser>);
    }
    for (const preview of this.state.previews) {
      const { command, lines, id } = preview;
      panels.push(<Preview id={id} command={command} lines={lines} onClose={this.onClose.bind(this)} />);
    }
    return <div>
    {panels}
    </div>;
  }

  private onClose(id: number): void {
    const previews = this.state.previews.slice().filter((preview: IPreview) => preview.id !== id);
    this.setState({ previews });
    const seq = this.props.seq.next().value;
    const key = this.props.connection.key;
    this.props.connection.send({ type: 'close', seq, key, id });
  }

  private ls(path: string): Promise<IBrowser> {
    return ls(path, this.props.connection, this.props.seq);
  }
}

export default function render(target: HTMLDivElement, connection: Connection): void {
  const seqGen = SeqGenerator();
  home(connection, seqGen).then((homePath: string) => {
    ReactDOM.render(<Main home={homePath} connection={connection} seq={seqGen}/>, target);
  });
}

function home(connection: Connection, seqGen: IterableIterator<number>): Promise<string> {
  const seq = seqGen.next().value;
  const key = connection.key;

  return connection.send({seq, key, type: 'home'})
  .then((result: {home: string}): string => {
    return result.home;
  });
}

function ls(path: string, connection: Connection, seqGen: IterableIterator<number>): Promise<IBrowser> {
  const seq = seqGen.next().value;
  const key = connection.key;

  return connection.send({seq, key, path, type: 'ls'})
  .then((result: {files: IFile[]}): IBrowser => {
    return { path, files: result.files };
  });
}
