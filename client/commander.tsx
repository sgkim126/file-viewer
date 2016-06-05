import * as Option from './icommandoption.ts';
import * as React from 'react';
import ICommandOption from './icommandoption.ts';
import ISelected from './iselected.ts';
import { Button, ButtonGroup } from 'react-bootstrap';

interface IProps {
  selecteds: ISelected[];

  openDir: (path: string, column: number) => void;
  onCommand: (command: string, option: ICommandOption) => void;
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
      return buttons;
    }

    if (!this.hasDir()) {
      buttons.push(this.catButton(this.props.selecteds));
      buttons.push(this.sortButton(this.props.selecteds));
    }

    if (this.props.selecteds.length === 1) {
      const selected = this.props.selecteds[0];
      if (selected.is_dir) {
        buttons.push(this.openButton(selected));
      } else {
        buttons.push(this.uniqButton(selected));
        buttons.push(this.headButton(selected));
        buttons.push(this.tailButton(selected));
      }
    }

    if (buttons.length === 0) {
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

  private catButton(selecteds: ISelected[]): JSX.Element {
    const onClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      const inputs = selecteds.map((selected: ISelected) => selected.input);
      const option: Option.ICatOption = { inputs };
      this.props.onCommand('cat', option);
    };
    return <Button key='cat' onClick={onClick}>cat</Button>;
  }

  private headButton(selected: ISelected): JSX.Element {
    const onClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      const input = selected.input;
      const option: Option.IHeadOption = { input };
      this.props.onCommand('head', option);
    };
    return <Button key='head' onClick={onClick}>head</Button>;
  }

  private tailButton(selected: ISelected): JSX.Element {
    const onClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      const input = selected.input;
      const option: Option.ITailOption = { input };
      this.props.onCommand('tail', option);
    };
    return <Button key='tail' onClick={onClick}>tail</Button>;
  }

  private uniqButton(selected: ISelected): JSX.Element {
    const onClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      const input = selected.input;
      const option: Option.IUniqOption = { input };
      this.props.onCommand('uniq', option);
    };
    return <Button key='uniq' onClick={onClick}>uniq</Button>;
  }

  private sortButton(selecteds: ISelected[]): JSX.Element {
    const onClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      const inputs = selecteds.map((selected: ISelected) => selected.input);
      const option: Option.ISortOption = { inputs };
      this.props.onCommand('sort', option);
    };
    return <Button key='sort' onClick={onClick}>sort</Button>;
  }

  private hasDir(): boolean {
    return !!this.props.selecteds.find((selected: ISelected) => selected.is_dir);
  }
}
