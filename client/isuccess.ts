interface ISuccess {
  seq: number;
  command: string;
  shortCommand: string;
  name: string;
  bytes: number;
  chars: number;
  words: number;
  lines: number;
  max_line_length: number;
}

export default ISuccess;
