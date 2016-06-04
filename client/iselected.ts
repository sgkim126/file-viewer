import ICommandInput from './icommandinput.ts';

interface ISelected {
  column?: number;
  is_dir?: boolean;
  input: ICommandInput;
}

export default ISelected;
