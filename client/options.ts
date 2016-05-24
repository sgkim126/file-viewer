export interface ICatOption {
  "number-nonblank"?: boolean;
  "show-ends"?: boolean;
  "number"?: boolean;
  "squeeze-blank"?: boolean;
  "show-tabs"?: boolean;
  "show-nonprinting"?: boolean;
}

export interface IHeadOption {
  lines?: number;
  bytes?: number;
}

export interface ITailOption {
  lines?: number;
  bytes?: number;
}

type CommandOption = ICatOption | IHeadOption | ITailOption;
export default CommandOption;
