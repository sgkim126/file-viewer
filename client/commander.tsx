import * as React from 'react';
import CommandOption from './options.ts';
import ISelected from './iselected.ts';
import { Button, ButtonGroup } from 'react-bootstrap';
import { ICommandInput } from './messages.ts';

interface IProps {
  selected: ISelected;

  openDir: (path: string, column: number) => void;
  onCommand: (command: string, input: ICommandInput, option: CommandOption) => void;
}

interface IState {
}

export default class Commander extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  public render(): JSX.Element {
    return <div className='commander'>
      <ButtonGroup>{this.buttons()}</ButtonGroup>
    </div>;
  }

  private buttons(): JSX.Element[] {
    const buttons: JSX.Element[] = [];
    if (!this.props.selected) {
      buttons.push(<Button disabled>No selected</Button>);
      return buttons;
    }

    if (this.props.selected.is_dir) {
      buttons.push(this.openButton());
    } else {
      buttons.push(this.catButton());
      buttons.push(this.headButton());
      buttons.push(this.tailButton());
    }

    return buttons;
  }

  private openButton(): JSX.Element {
    const onClick = () => {
      this.props.openDir(this.props.selected.path, this.props.selected.column);
    };
    return <Button onClick={onClick}>open</Button>;
  }

  private catButton(): JSX.Element {
    const onClick = () => {
      this.props.onCommand('cat', { file: this.props.selected.path }, {});
    };
    return <Button onClick={onClick}>cat</Button>;
  }

  private headButton(): JSX.Element {
    const onClick = () => {
      this.props.onCommand('head', { file: this.props.selected.path }, {});
    };
    return <Button onClick={onClick}>head</Button>;
  }

  private tailButton(): JSX.Element {
    const onClick = () => {
      this.props.onCommand('tail', { file: this.props.selected.path }, {});
    };
    return <Button onClick={onClick}>tail</Button>;
  }
}
