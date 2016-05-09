interface ICommand {
  type: string;
  key: string;
  seq: number;
}

interface IPwd extends ICommand {
  type: 'pwd';
}

interface ILs extends ICommand {
  type: 'ls';
  path: string;
}

interface ICat extends ICommand {
  type: 'cat';
  path: string;
}

export type Command = IPwd | ILs | ICat;
