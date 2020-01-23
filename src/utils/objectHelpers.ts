import { NameConventions, ResultType } from '../models/types';
import { strFormatter } from './stringHelpers';

const specialChar = /[\s`~!@#~´º%^&*()|+\-=?;:'",.<>\{\}\[\]\\\/]/gi;
type FormatterOpt = { nameConv?: NameConventions; extraChar?: RegExp | string };
/**
 * @param obj Convert all the oject key names to PascalCase key name
 * @param nameConvt optional formatter for the object, see type NameConvetions type for more info.
 * @param extraChar A RegExp or a string to be removed from the object name
 * @example const BaddObjArr = [{" _gross sa*le  ": 200, " data de separação": new Date()}];
 * Output: BaddObjArr = [{GrossSale: 200, DataDeSeparacao: Mon Jan 13 2020...}]
 */
export const objFormatter = (obj: object, opt?: FormatterOpt) => {
  let name = opt?.nameConv;
  let char = opt?.extraChar;
  if (
    obj === null ||
    (Object.getPrototypeOf(obj).constructor.name !== 'Array' &&
      Object.getPrototypeOf(obj).constructor.name !== 'Object' &&
      Object.getPrototypeOf(obj).constructor.name !== 'Function')
  )
    return obj;
  if (Object.getPrototypeOf(obj).constructor.name === 'Function')
    Object.defineProperty(obj, 'name', { value: 'New Name' });
  return Object.keys(obj).reduce(
    (acc, key) => {
      acc[strFormatter(key, opt?.nameConv! ?? 'PascalCase', opt?.extraChar! ?? specialChar)] =
        typeof obj[key] == 'string'
          ? obj[key].trim()
          : objFormatter(obj[key], { nameConv: name! ?? undefined, extraChar: char! ?? specialChar });
      return acc;
    },
    Array.isArray(obj) ? [] : {},
  );
};
const initialValue = {} as const;
export function convertArrayToObject<T, R>(array: T[], key: keyof T): ResultType<R> {
  let reducedArry = array.reduce((obj, item) => {
    return {
      ...obj,
      [item[key as string | number | symbol]]: item,
    };
  }, initialValue);
  return reducedArry;
}
