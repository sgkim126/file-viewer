import ICommandInput from './icommandinput.ts';

interface ISelected {
  column?: number;
  is_dir?: boolean;
  input: ICommandInput;
  resultSeq?: number;
}

export default ISelected;
