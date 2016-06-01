interface IResult {
  id: number;
  command: string;
  name: string;
  bytes: number;
  chars: number;
  words: number;
  lines: number;
  max_line_length: number;
}

export default IResult;
