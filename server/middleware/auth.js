import jwt from 'jsonwebtoken';

export const isUser = (req, res, next) => {
    const tokenCookie = req.cookies.token; // Assuming the token is stored in a cookie named "token"

    if (!tokenCookie) {
        return res.status(401).json({ message: 'Unauthorized - No token provided' });
    }

    try {
        const decoded = jwt.verify(tokenCookie, "umar");
        req.user = decoded;
        console.log(decoded);
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Forbidden - Invalid token' });
    }
};
