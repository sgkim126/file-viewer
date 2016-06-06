import IPending from './ipending.ts';
import ISuccess from './isuccess.ts';

interface IResult {
  seq: number;
  success?: ISuccess;
  pending?: IPending;
}

export default IResult;
