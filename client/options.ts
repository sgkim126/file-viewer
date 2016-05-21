export interface ICatOption {
}

export interface IHeadOption {
  lines?: number;
  bytes?: number;
}

type CommandOption = ICatOption | IHeadOption;
export default CommandOption;
