interface ICommand {
  type: string;
  key: string;
  seq: number;
}

interface IHome extends ICommand {
  type: 'home';
}

interface ILs extends ICommand {
  type: 'ls';
  path: string;
}

interface IClose extends ICommand {
  type: 'close';
  id: number;
}

interface ICat extends ICommand {
  type: 'cat';
  path: string;
}

export type Command = IHome | ILs | IClose | ICat;
