import ICommandInput from './icommandinput.ts';

interface ISelected {
  seq?: number;

  column?: number;
  is_dir?: boolean;
  input?: ICommandInput;

  title: string;
  name: string;
}

export default ISelected;
