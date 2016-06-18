interface IFailure {
  seq: number;
  error?: string;
  errors?: string[];

  command?: string;
  shortCommand?: string;
  name?: string;
}

export default IFailure;
