export interface ICatOption {
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
