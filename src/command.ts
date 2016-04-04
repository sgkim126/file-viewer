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

export type Command = IPwd | ILs;
