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

export interface IUniqOption {
  count?: boolean;
  repeated?: boolean;
  "all-repeated"?: string;
  "skip-fields"?: number;
  "ignore-case"?: boolean;
  "skip-chars"?: number;
  unique?: boolean;
  "zero-terminated"?: boolean;
  "check-chars"?: number;

  input: ICommandInput;
}

export interface ISortOption {
  "ignore-leading-blanks"?: boolean;
  "dictionary-order"?: boolean;
  "ignore-case"?: boolean;
  "general-numeric-sort"?: boolean;
  "ignore-nonprinting"?: boolean;
  "month-sort"?: boolean;
  "human-numeric-sort"?: boolean;
  "numeric-sort"?: boolean;
  "random-sort"?: boolean;
  reverse?: boolean;
  "version-sort"?: boolean;

  "batch-size"?: number;
  check?: boolean;
  "check-silent"?: boolean;
  debug?: boolean;
  "files0-from"?: ICommandInput;
  key?: number[];
  merge?: boolean;
  stable?: boolean;
  "buffer-size"?: number;
  "field-seperator"?: string;
  parallel?: number;
  unique?: boolean;
  "zero-terminated"?: boolean;

  inputs: ICommandInput[];
}

type ICommandOption = ICatOption | IHeadOption | ITailOption | IUniqOption | ISortOption;

export default ICommandOption;
