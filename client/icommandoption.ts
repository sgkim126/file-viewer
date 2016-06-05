import ICommandInput from './icommandinput.ts';

export interface ICatOption {
  numberNonblank?: boolean;
  showEnds?: boolean;
  number?: boolean;
  squeezeBlank?: boolean;
  showTabs?: boolean;
  showNonprinting?: boolean;

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

export interface IUniqOption {
  count?: boolean;
  repeated?: boolean;
  allRepeated?: string;
  skipFields?: number;
  ignoreCase?: boolean;
  skipChars?: number;
  unique?: boolean;
  zeroTerminated?: boolean;
  checkChars?: number;

  input: ICommandInput;
}

export interface ISortOption {
  ignoreLeadingBlanks?: boolean;
  dictionaryOrder?: boolean;
  ignoreCase?: boolean;
  generalNumericSort?: boolean;
  ignoreNonprinting?: boolean;
  monthSort?: boolean;
  humanNumericSort?: boolean;
  numericSort?: boolean;
  randomSort?: boolean;
  reverse?: boolean;
  versionSort?: boolean;

  batchSize?: number;
  check?: boolean;
  checkSilent?: boolean;
  debug?: boolean;
  files0From?: ICommandInput;
  key?: number[];
  merge?: boolean;
  stable?: boolean;
  bufferSize?: number;
  fieldSeperator?: string;
  parallel?: number;
  unique?: boolean;
  zeroTerminated?: boolean;

  inputs: ICommandInput[];
}

type ICommandOption = ICatOption | IHeadOption | ITailOption | IUniqOption | ISortOption;

export default ICommandOption;
