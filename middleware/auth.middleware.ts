import type { NextFunction, Request, Response } from "express";

export function authMiddleware(req: Request, res: Response, next: NextFunction){
    const authorizationToken = req.headers["authorization"]
    // Verify the JWT
    req.userId = "1";
    next();
}