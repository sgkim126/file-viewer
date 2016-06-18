const { Checkbox, ControlLabel, FormControl, FormGroup, HelpBlock, Radio } = require('react-bootstrap');
import { findDOMNode } from 'react-dom';
import * as Option from './icommandoption.ts';
import * as React from 'react';
import ICommandOption from './icommandoption.ts';
import ISelected from './iselected.ts';
import { Button, ButtonGroup, Modal } from 'react-bootstrap';

interface IProps {
  selecteds: ISelected[];

  openDir: (path: string, column: number) => void;
  onCommand: (command: string, option: ICommandOption) => void;
}

interface IState {
  menu?: {
    title: string,
    body: JSX.Element,
    onSubmit: (e: React.FormEvent) => void,
  };
}

export default class NoviceCommander extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      menu: undefined,
    };
  }

  public render(): JSX.Element {
    return <div className='commander'>
      <ButtonGroup>{this.buttons()}</ButtonGroup>
      {this.menu()}
    </div>;
  }

  private menu(): JSX.Element {
    const menu = this.state.menu;
    if (!menu) {
      return undefined;
    }
    const header = menu.title ? <Modal.Header closeButton><Modal.Title>{menu.title}</Modal.Title></Modal.Header> : undefined;
    const body = menu.body ? <Modal.Body>{menu.body}</Modal.Body> : undefined;
    const footer = menu.onSubmit ? <Modal.Footer><Button onClick={menu.onSubmit}>Run</Button></Modal.Footer> : undefined;
    return <Modal show={!!menu} onHide={() => this.setState({ menu: undefined })}>
      {header}
      {body}
      {footer}
      </Modal>;
  }

  private buttons(): JSX.Element[] {
    const { selecteds } = this.props;
    const buttons: JSX.Element[] = [];
    if (this.props.selecteds.length === 0) {
      buttons.push(<Button key='no-selected' disabled>No selected</Button>);
      return buttons;
    }

    if (selecteds.length === 1) {
      const selected = this.props.selecteds[0];
      if (selected.is_dir) {
        buttons.push(this.openButton(selected));
      }
    } else if (selecteds.length === 2) {
      if (!this.hasDir()) {
        buttons.push(this.intersectButton(selecteds[0], selecteds[1]));
        buttons.push(this.subButton(selecteds[0], selecteds[1]));
        buttons.push(this.subButton(selecteds[1], selecteds[0]));
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

  private intersectButton(selected1: ISelected, selected2: ISelected): JSX.Element {
    const onClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      const input1 = selected1.input;
      const input2 = selected2.input;
      const Column1 = true;
      const Column2 = true;
      const NocheckOrder = true;
      const option = { input1, input2, Column1, Column2, NocheckOrder, };
      this.props.onCommand('comm', option);
    };

    return <Button key='intersect' onClick={onClick}>intersect</Button>;
  }

  private subButton(selected1: ISelected, selected2: ISelected): JSX.Element {
    const onClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      const input1 = selected1.input;
      const input2 = selected2.input;
      const Column2 = true;
      const Column3 = true;
      const NocheckOrder = true;
      const option = { input1, input2, Column2, Column3, NocheckOrder, };
      this.props.onCommand('comm', option);
    };

    return <Button key={`${selected1.name} - ${selected2.name}`} onClick={onClick}>{selected1.name} - {selected2.name}</Button>;
  }

  private hasDir(): boolean {
    return !!this.props.selecteds.find((selected: ISelected) => selected.is_dir);
  }
}
