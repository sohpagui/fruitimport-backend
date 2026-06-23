import { JwtPayload } from '../types';
export declare function genererAccessToken(payload: JwtPayload): string;
export declare function genererRefreshToken(payload: JwtPayload): string;
export declare function verifierAccessToken(token: string): JwtPayload;
export declare function verifierRefreshToken(token: string): JwtPayload;
//# sourceMappingURL=jwt.d.ts.map