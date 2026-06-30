import { Request, Response } from 'express';
export declare function listerClients(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function detailClient(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function modifierLimiteCredit(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function ajouterPaiement(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function fixerEcheance(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function ajouterVersement(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function historiqueVersements(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function lancerJobInterets(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=client.controller.d.ts.map