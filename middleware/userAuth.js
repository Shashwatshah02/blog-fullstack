import { verifyToken } from '../jwt.js';

export const ensureAuthenticated = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Extract token from the Authorization header

    if (!token) {
        return res.status(401).json({ error: 'No token provided' }); // No token means unauthorized
    }

    try {
        const decoded = verifyToken(token); // Verify the token
        req.user = decoded; // Store user info in request for later use
        next(); // Proceed to the next middleware or route
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' }); // Token is invalid
    }
};
