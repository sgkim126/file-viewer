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
  option: any;
}

export interface ICat extends ICommand {
  command: 'cat';
  option: any;
}

export interface ITac extends ICommand {
  command: 'tac';
  option: any;
}

export interface IHead extends ICommand {
  command: 'head';
  option: any;
}

export interface ITail extends ICommand {
  command: 'tail';
  option: any;
}

export interface IUniq extends ICommand {
  command: 'uniq';
  option: any;
}

export interface ISort extends ICommand {
  command: 'sort';
  option: any;
}

export interface IComm extends ICommand {
  command: 'comm';
  option: any;
}

export interface ICut extends ICommand {
  command: 'cut';
  option: any;
}

type Message = ILs | IClose | IMore | ICommand;
export default Message;
