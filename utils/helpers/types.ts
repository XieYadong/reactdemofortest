export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';
export type ResponseType =
  | 'arraybuffer'
  | 'document'
  | 'json'
  | 'text'
  | 'stream'
  | 'blob';

export interface AxiosRequest {
  baseURL?: string;
  url: string;
  data?: any;
  params?: any;
  method?: Method;
  headers?: any;
  timeout?: number;
  token?: string;
  responseType?: ResponseType;
}

export interface AxiosResponse {
  data: any;
  headers: any;
  request?: any;
  status: number;
  statusText: string;
  config: AxiosRequest;
}

export interface CustomResponse {
  readonly message: string;
  data: any;
  origin?: any;
}

export interface GetDemo {
  id: number;
  str: string;
}

export interface PostDemo {
  id: number;
  list: Array<{
    id: number;
    version: number;
  }>;
}
