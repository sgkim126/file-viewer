interface IFailure {
  seq: number;
  error?: string;
  errors?: string[];

  command?: string;
  shortCommand?: string;
}

export default IFailure;
