
import jwt from 'jsonwebtoken';

export const verifyUser = (req, res, next) => { 


    const token = req.cookies.access_token;

    

    if (!token) {
        const error = new Error('unauthorized');
        error.statusCode = 401;
        next(error);
        return;
    }

    const validuser = jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            const error = new Error('Forbidden');
            error.statusCode = 403;
            next(error);
            return;
        }

        
        req.user = user;
        next();
    });

    
}