import { Response } from 'express';
export declare function repondreSucces(res: Response, data: any, message?: string, statusCode?: number): Response<any, Record<string, any>>;
export declare function repondreErreur(res: Response, message: string, statusCode?: number, details?: any): Response<any, Record<string, any>>;
//# sourceMappingURL=response.d.ts.map