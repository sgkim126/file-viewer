const { Checkbox, ControlLabel, FormControl, FormGroup, HelpBlock, Radio } = require('react-bootstrap');
import { findDOMNode } from 'react-dom';
import * as Option from './icommandoption.ts';
import * as React from 'react';
import ICommandConfig from './icommandconfig.ts';
import ICommandFlag from './icommandflag.ts';
import ICommandOption from './icommandoption.ts';
import ISelected from './iselected.ts';
import { Button, ButtonGroup, Modal } from 'react-bootstrap';

interface IProps {
  configs: ICommandConfig[];
  selecteds: ISelected[];

  onCommand: (command: string, option: ICommandOption) => void;
}

interface IState {
  menu?: {
    title: string,
    body: JSX.Element,
    onSubmit: (e: React.FormEvent) => void,
  };
}

export default class AdvancedCommander extends React.Component<IProps, IState> {
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
    const footer = menu.onSubmit ? <Modal.Footer><Button autofocus onClick={menu.onSubmit}>Run</Button></Modal.Footer> : undefined;
    return <Modal show={!!menu} onHide={() => this.setState({ menu: undefined })}>
      {header}
      {body}
      {footer}
      </Modal>;
  }

  private buttons(): JSX.Element[] {
    const { configs, selecteds } = this.props;

    if (selecteds.length === 0) {
      return [ <Button key='no-selected' disabled>No selected</Button> ];
    }

    const buttons: JSX.Element[] = configs
      .map((config: ICommandConfig) => {
        const flags = config.flags.filter((flag: ICommandFlag) => flag.type !== 'not-implemented');
        return this.button(config.name, config.desc, config.input, selecteds, flags);
      }).filter((button: JSX.Element) => button != null);
    if (buttons.length === 0) {
      buttons.push(<Button key='no-available' disabled>No available command</Button>);
    }
    return buttons;
  }

  private button(name: string, desc: string, input: string, selecteds: ISelected[], flags: ICommandFlag[]): JSX.Element {
    switch (input) {
      case 'one':
        if (this.hasDir()) {
          return undefined;
        }
        if (selecteds.length === 1) {
          return this.oneButton(name, desc, selecteds[0], flags);
        }
        break;
      case 'two':
        if (this.hasDir()) {
          return undefined;
        }
        if (selecteds.length === 2) {
          return this.twoButton(name, desc, selecteds[0], selecteds[1], flags);
        }
        break;
      case 'multi':
        if (this.hasDir()) {
          return undefined;
        }
        if (selecteds.length !== 0) {
          return this.multiButton(name, desc, selecteds, flags);
        }
      default:
        if (selecteds.length !== 0) {
          return this.multiButton(name, desc, selecteds, flags);
        }
        break;
    }
    return undefined;
  }

  private oneButton(name: string, desc: string, selected: ISelected, flags: ICommandFlag[]): JSX.Element {
    const onClick = (e: React.MouseEvent) => {
      e.stopPropagation();

      const option = flags.map((flag: ICommandFlag) => flagOption(flag));
      const title = name;

      const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const input = selected.input;
        const options = option.reduce((option: any, flag: { setFlag: (_: any) => any }) => flag.setFlag(option), { input });

        this.props.onCommand(name, options);
        this.setState({ menu: undefined });
      };

      const body = <form onSubmit={onSubmit}>
        {option.map((flag: { form: JSX.Element }) => flag.form)}
      </form>;

      this.setState({ menu: { title, body, onSubmit,  } });
    };

    return <Button key={name} title={desc} onClick={onClick}>{name}</Button>;
  }

  private twoButton(name: string, desc: string, selected1: ISelected, selected2: ISelected, flags: ICommandFlag[]): JSX.Element {
    const onClick = (e: React.MouseEvent) => {
      e.stopPropagation();

      const option = flags.map((flag: ICommandFlag) => flagOption(flag));
      const title = name;

      const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const input1 = selected1.input;
        const input2 = selected2.input;
        const options = option.reduce((option: any, flag: { setFlag: (_: any) => any }) => flag.setFlag(option), { input1, input2 });

        this.props.onCommand(name, options);
        this.setState({ menu: undefined });
      };

      const body = <form onSubmit={onSubmit}>
        {option.map((flag: { form: JSX.Element }) => flag.form)}
      </form>;

      this.setState({ menu: { title, body, onSubmit,  } });
    };

    return <Button key={name} title={desc} onClick={onClick}>{name}</Button>;
  }

  private multiButton(name: string, desc: string, selecteds: ISelected[], flags: ICommandFlag[]): JSX.Element {
    const onClick = (e: React.MouseEvent) => {
      e.stopPropagation();

      const option = flags.map((flag: ICommandFlag) => flagOption(flag));
      const title = name;

      const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const inputs = selecteds.map((selected: ISelected) => selected.input);
        const options = option.reduce((option: any, flag: { setFlag: (_: any) => any }) => flag.setFlag(option), { inputs });

        this.props.onCommand(name, options);
        this.setState({ menu: undefined });
      };

      const body = <form onSubmit={onSubmit}>
        {option.map((flag: { form: JSX.Element }) => flag.form)}
      </form>;

      this.setState({ menu: { title, body, onSubmit,  } });
    };

    return <Button key={name} title={desc} onClick={onClick}>{name}</Button>;
  }

  private hasDir(): boolean {
    return !!this.props.selecteds.find((selected: ISelected) => selected.is_dir);
  }
}

function stringOption(option: ICommandFlag): { setFlag: (_: any) => any, form: JSX.Element } {
  let ref: HTMLInputElement;
  const setFlag = (flags: any) => {
    const value = (findDOMNode(ref) as HTMLInputElement).value;
    if (value !== '') {
      flags[option.name] = value;
    }
    return flags;
  };

  const form: JSX.Element = <FormGroup key={option.name}>
    <ControlLabel>{option.long}</ControlLabel>
    <FormControl ref={(inputRef: HTMLInputElement) => { ref = inputRef; }} type='text' placeholder={option.long} />
    <HelpBlock>{option.desc}</HelpBlock>
  </FormGroup>;

  return { setFlag, form };
}

function boolOption(option: ICommandFlag): { setFlag: (_: any) => any, form: JSX.Element } {
  let ref: HTMLInputElement;
  const setFlag = (flags: any) => {
    const checked = ref.checked;
    if (checked) {
      flags[option.name] = true;
    }
    return flags;
  };

  const form: JSX.Element = <FormGroup key={option.name}>
    <Checkbox inputRef={(inputRef: HTMLInputElement) => { ref = inputRef; }}>{option.long}</Checkbox>
    <HelpBlock>{option.desc}</HelpBlock>
  </FormGroup>;

  return { setFlag, form };
}

function intOption(option: ICommandFlag): { setFlag: (_: any) => any, form: JSX.Element } {
  let ref: HTMLInputElement;
  const setFlag = (flags: any) => {
    const value = (findDOMNode(ref) as HTMLInputElement).value;
    if (value !== "") {
      flags[option.name] = parseInt(value, 10);
    }
    return flags;
  };
  const form = <FormGroup key={option.name}>
    <ControlLabel>{option.long}</ControlLabel>
    <FormControl ref={(inputRef: HTMLInputElement) => { ref = inputRef; }} type='number' placeholder={option.long} />
    <HelpBlock>{option.desc}</HelpBlock>
  </FormGroup>;

  return { setFlag, form };
}

function enumOption(option: ICommandFlag): { setFlag: (_: any) => any, form: JSX.Element } {
  const values = option.type.split(',');
  let refs: HTMLInputElement[] = [];


  const setFlag = (flags: any) => {
    const value = () => values.find((value: string, i: number) => (findDOMNode(refs[i]) as any).checked);
    if (value != null) {
      flags[option.name] = value;
    }
    return flags;
  };

  const clearElse = (checked: number) => {
    const len = refs.length;
    for (let i = 0; i < len; i += 1) {
      if (i === checked) {
        continue;
      }
      (findDOMNode(refs[i]) as any).checked = false;
    }
  };

  const radio = (value: string, i: number) => <Radio key={i} onChange={() => clearElse(i)} inline defaultChecked={i === 0} inputRef={(ref: HTMLInputElement) => { refs[i] = ref;}}>{value}</Radio>;
  const form = <FormGroup key={option.name}>
    <ControlLabel>{option.long}</ControlLabel>
    {values.map(radio)}
    <HelpBlock>{option.desc}</HelpBlock>
  </FormGroup>;

  return { setFlag, form };
}


function flagOption(option: ICommandFlag): { setFlag: (_: any) => any, form: JSX.Element } {
  switch (option.type) {
  case 'int':
    return intOption(option);
  case 'string':
    return stringOption(option);
  case 'bool':
    return boolOption(option);
  default:
    return enumOption(option);
  }
}
