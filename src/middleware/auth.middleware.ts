import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];
    if (!token) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    let decoded
    //@ts-ignore
    decoded = jwt.decode(token, process.env.JWT_SECRET as string, { algorithms: ['RS256'] });
    // console.log(decoded);
    if(!decoded?.sub){
        res.json({error:"Unauthorized"});
        return;
    }
    req.userId = decoded?.sub;
    next();
};
