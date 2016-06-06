interface IFailure {
  seq: number;
  error?: string;
  errors?: string[];

  command?: string;
  name?: string;
}

export default IFailure;
