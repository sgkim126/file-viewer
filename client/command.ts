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

interface ICat extends ICommand {
  type: 'cat';
  path: string;
}

export type Command = IHome | ILs | ICat;
