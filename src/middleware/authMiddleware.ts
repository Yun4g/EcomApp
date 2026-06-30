import jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";
import { AuthRequest, JwtPayload } from "../types/authType";



export const AuthMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
     const token = req.cookies.accessToken  || req.headers['authorization']?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'Unauthorized token missing ' });
        }
        try {
           const decoded = jwt.verify(token, process.env.ACCESS_JWT_SECRET as string ) as JwtPayload
           req.userId = decoded.userId
            next();
        } catch (error) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
    
}