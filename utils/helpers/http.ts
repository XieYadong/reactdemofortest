import isObject from 'lodash/isObject';
import startsWith from 'lodash/startsWith';
import { stringify } from 'querystring';
import { isUndefined, omitBy } from 'lodash';

type HttpMethodsSupported = 'GET' | 'POST' | 'PUT' | 'DELETE';
type ResponseTypeSupported =
  | 'arraybuffer'
  | 'document'
  | 'json'
  | 'text'
  | 'stream'
  | 'blob';

interface RequestOptions extends RequestInit {
  method?: HttpMethodsSupported;
  headers?: Record<string, string>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any;
  query?: any;
  responseType?: ResponseTypeSupported;
  autoParse?: boolean;
  token?: string;
  validateStatus?: (status?: number) => boolean;
}

interface HandledExceptionDescription {
  code?: string | number;
  statusCode: number;
  details?: string;
  meta?: any;
}
export function omitEmptyQuery(
  source: Record<string, string | number | string[]>
) {
  return omitBy(source, val => isUndefined(val) || val == '');
}
export abstract class RequestExceptions extends Error {
  readonly code: string | number;
  constructor(message: string, code: string | number) {
    super(message);
    this.code = code;
  }
}

export class RequestFailingException extends RequestExceptions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(message: string, code: string | number) {
    super(message, code);
  }
}

export class RequestParsingException extends RequestExceptions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(message: string, code: string | number) {
    super(message, code);
  }
}

export class RequestHandledException
  extends RequestExceptions
  implements HandledExceptionDescription {
  readonly statusCode: number;
  readonly details?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly meta?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(message: string, description: HandledExceptionDescription) {
    super(message, description.code || description.statusCode);

    this.details = description.details || message;
    this.statusCode = description.statusCode;
    this.meta = description.meta || {};
  }
}

export const defaultValidStatus = (status: number): boolean => {
  return status < 400; // Resolve only if the status code is less than 500
};

export const ignoreStatusValidation = (): boolean => true;

export function shallowCopySkipEmptyString(source: Record<string, unknown>) {
  const target = {};
  Object.keys(source).forEach(key => {
    if (source[key] && source[key] != '') {
      target[key] = source[key];
    }
  });
  return target;
}

export async function request(
  url: string,
  options: RequestOptions = {}
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
  const {
    method = 'GET',
    responseType = 'json',
    headers = {},
    autoParse = true,
    validateStatus = defaultValidStatus,
    token,
    query,
    ...fetchOptions
  } = options;
  console.log('🚀 ~ file: http.ts ~ line 103 ~ options', options);
  let response: Response;
  let reqBodyTransformed = fetchOptions.body;
  let resBodyParsed;
  let destUrl: string = url;
  // Recognize request's header `Content-Type`
  if (typeof window !== 'undefined' && fetchOptions.body instanceof FormData) {
    reqBodyTransformed = fetchOptions.body;
  } else if (!headers['Content-Type']) {
    if (isObject(fetchOptions.body)) {
      headers['Content-Type'] = 'application/json';
      reqBodyTransformed = JSON.stringify(fetchOptions.body);
    }
  } else {
    if (
      startsWith(headers['Content-Type'], 'application/x-www-form-urlencoded')
    ) {
      reqBodyTransformed = stringify(fetchOptions.body);
    } else {
      reqBodyTransformed = JSON.stringify(fetchOptions.body);
    }
  }

  // Fill in request's header`Accept` based on `responseType`, unless provided expicitily
  if (!headers['Accept']) {
    switch (responseType) {
      // TODO: not final
      case 'arraybuffer':
      case 'blob':
      case 'stream':
        headers['Accept'] = 'application/octet-stream';
        break;
      case 'document':
        headers['Accept'] = 'text/html';
        break;
      case 'text':
        headers['Accept'] = 'text/plain';
        break;
      case 'json':
        headers['Accept'] = 'application/json';
        break;
      default:
        headers['Accept'] = 'application/json, text/plain, */*';
    }
  }

  // Attach bearer token
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Attach query
  if (isObject(query)) {
    const queryCopy = shallowCopySkipEmptyString(query as any);
    destUrl =
      Object.keys(queryCopy).length > 0
        ? `${url}?${stringify(queryCopy)}`
        : url;
    console.log('destUrl:', destUrl);
  }

  try {
    response = await fetch(destUrl, {
      ...fetchOptions,
      method,
      headers,
      body: reqBodyTransformed
    });
  } catch (err) {
    throw new RequestFailingException(err.message, 0);
  }

  // Determine whether to continue parsing the response
  if (!autoParse) {
    return response;
  }

  try {
    switch (responseType) {
      case 'arraybuffer':
        resBodyParsed = await response.arrayBuffer();
        break;
      case 'blob':
        resBodyParsed = await response.blob();
        break;
      case 'stream':
        // TODO: not final
        resBodyParsed = await response.arrayBuffer();
        break;
      case 'document':
      case 'text':
        resBodyParsed = await response.text();
        break;
      case 'json':
        resBodyParsed = await response.json();
        break;
      default:
        resBodyParsed = await response.json();
        break;
    }
  } catch (err) {
    throw new RequestParsingException(err.message, 0);
  }

  // Determine whether to check response's status code or not
  if (validateStatus(response.status)) {
    return resBodyParsed;
  } else {
    // Handle error based on error body received.
    switch (responseType) {
      case 'json':
        const message = resBodyParsed.errMsg ?? resBodyParsed.message;
        throw new RequestHandledException(message, {
          statusCode: response.status,
          code: resBodyParsed.code,
          details: resBodyParsed.details ?? message,
          meta: resBodyParsed.meta
        });
      default:
        throw new RequestFailingException('请求失败', response.status);
    }
  }
}

export async function fetcher(
  url: string,
  token?: string,
  options: RequestOptions = {}
): Promise<any> {
  return request(url, {
    token,
    ...options
  });
}
