import CommandOption from './options.ts';
import * as Option from './options.ts';

export interface IMessage {
  type: string;
  key: string;
  seq: number;
}

export interface IHome extends IMessage {
  type: 'home';
}

export interface ILs extends IMessage {
  type: 'ls';
  path: string;
}

export interface IClose extends IMessage {
  type: 'close';
  id: number;
}

interface ICommand extends IMessage {
  type: 'command';
  command: string;
  option: CommandOption;
  [input: string]: ICommandInput;
}

export interface ICommandInput {
  file?: string;
  pipe?: number;
}

export interface ICat extends ICommand {
  command: 'cat';
  input: ICommandInput;
  option: Option.ICatOption;
}

export interface IHead extends ICommand {
  command: 'head';
  input: ICommandInput;
  option: Option.IHeadOption;
}

export interface ITail extends ICommand {
  command: 'tail';
  input: ICommandInput;
  option: Option.ITailOption;
}

type Message = IHome | ILs | IClose | ICommand;
export default Message;
