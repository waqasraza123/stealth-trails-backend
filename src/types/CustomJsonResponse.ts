export type CustomJsonResponse<T = any> = {
    status: 'failed' | 'success';
    message: string;
    error?: object | object[];
    data?: T;
};
  