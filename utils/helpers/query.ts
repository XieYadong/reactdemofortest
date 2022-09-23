import { isUndefined, omitBy } from 'lodash';

export function omitEmptyQuery(
  source: Record<string, string | number | string[]>
) {
  return omitBy(source, val => isUndefined(val) || val == '');
}
