import ICommandInput from './icommandinput.ts';

export interface ICatOption {
  "number-nonblank"?: boolean;
  "show-ends"?: boolean;
  "number"?: boolean;
  "squeeze-blank"?: boolean;
  "show-tabs"?: boolean;
  "show-nonprinting"?: boolean;

  inputs: ICommandInput[];
}

export interface IHeadOption {
  lines?: number;
  bytes?: number;

  input: ICommandInput;
}

export interface ITailOption {
  lines?: number;
  bytes?: number;

  input: ICommandInput;
}

type ICommandOption = ICatOption | IHeadOption | ITailOption;

export default ICommandOption;
