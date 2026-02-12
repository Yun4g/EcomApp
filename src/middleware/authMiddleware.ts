import jwt from "jsonwebtoken";
import { JwtPayload } from "../types/authType";


export const AuthMiddleware = (req: any, res: any, next: any) => {
     const token = req.cookies.accesstoken || req.headers['authorization']?.split(' ')[1];

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