interface ICommand {
  type: string;
  key: string;
  seq: number;
}

interface IPwd extends ICommand {
  type: 'pwd';
}

export type Command = IPwd;
