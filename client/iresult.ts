import IFailure from './ifailure.ts';
import IPending from './ipending.ts';
import ISuccess from './isuccess.ts';

interface IResult {
  seq: number;
  failure?: IFailure;
  pending?: IPending;
  success?: ISuccess;
}

export default IResult;
