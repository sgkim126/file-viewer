import * as Option from './icommandoption.ts';
import ICommandOption from './icommandoption.ts';

export interface IMessage {
  type: string;
  token: string;
  seq: number;
}

export interface ILs extends IMessage {
  type: 'ls';
  path: string;
}

export interface IClose extends IMessage {
  type: 'close';
}

export interface IMore extends IMessage {
  type: 'more';
  start: number;
  lines: number;
}

interface ICommand extends IMessage {
  type: 'command';
  command: string;
  option: ICommandOption;
}

export interface ICat extends ICommand {
  command: 'cat';
  option: Option.ICatOption;
}

export interface ITac extends ICommand {
  command: 'tac';
  option: Option.ITacOption;
}

export interface IHead extends ICommand {
  command: 'head';
  option: Option.IHeadOption;
}

export interface ITail extends ICommand {
  command: 'tail';
  option: Option.ITailOption;
}

export interface IUniq extends ICommand {
  command: 'uniq';
  option: Option.IUniqOption;
}

export interface ISort extends ICommand {
  command: 'sort';
  option: Option.ISortOption;
}

export interface ICut extends ICommand {
  command: 'cut';
  option: Option.ICutOption;
}

type Message = ILs | IClose | IMore | ICommand;
export default Message;
