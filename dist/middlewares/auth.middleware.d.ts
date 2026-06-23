import { Request, Response, NextFunction } from 'express';
export declare function authentifier(req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>>;
export declare function autoriser(...rolesAutorises: string[]): (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
export declare function verifierAgence(req: Request, res: Response, next: NextFunction): void | Response<any, Record<string, any>>;
//# sourceMappingURL=auth.middleware.d.ts.map