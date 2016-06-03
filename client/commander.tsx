import * as React from 'react';
import CommandOption from './options.ts';
import ISelected from './iselected.ts';
import { Button, ButtonGroup } from 'react-bootstrap';
import { ICommandInput } from './messages.ts';

interface IProps {
  selecteds: ISelected[];

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
    if (this.props.selecteds.length === 0) {
      buttons.push(<Button key='no-selected' disabled>No selected</Button>);
    } else if (this.props.selecteds.length === 1) {
      const selected = this.props.selecteds[0];
      if (selected.is_dir) {
        buttons.push(this.openButton(selected));
      } else {
        buttons.push(this.catButton(selected));
        buttons.push(this.headButton(selected));
        buttons.push(this.tailButton(selected));
      }
    } else {
      buttons.push(<Button key='no-available' disabled>No available command</Button>);
    }

    return buttons;
  }

  private openButton(selected: ISelected): JSX.Element {
    const onClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      this.props.openDir(selected.input.file, selected.column + 1);
    };
    return <Button key='open' onClick={onClick}>open</Button>;
  }

  private catButton(selected: ISelected): JSX.Element {
    const onClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      this.props.onCommand('cat', selected.input, {});
    };
    return <Button key='cat' onClick={onClick}>cat</Button>;
  }

  private headButton(selected: ISelected): JSX.Element {
    const onClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      this.props.onCommand('head', selected.input, {});
    };
    return <Button key='head' onClick={onClick}>head</Button>;
  }

  private tailButton(selected: ISelected): JSX.Element {
    const onClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      this.props.onCommand('tail', selected.input, {});
    };
    return <Button key='tail' onClick={onClick}>tail</Button>;
  }
}
