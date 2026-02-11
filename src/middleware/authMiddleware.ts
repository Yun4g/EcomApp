


export const AuthMiddleware = (req: any, res: any, next: any) => {
     const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'Unauthorized token missing ' });
        }
        try {
            next();
        } catch (error) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
    
}