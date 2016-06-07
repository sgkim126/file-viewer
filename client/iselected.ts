import ICommandInput from './icommandinput.ts';

interface ISelected {
  column?: number;
  is_dir?: boolean;
  input?: ICommandInput;
  resultSeq?: number;

  title: string;
  name: string;
}

export default ISelected;
