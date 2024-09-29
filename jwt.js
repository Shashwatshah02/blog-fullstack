// jwt.js
import jwt from 'jsonwebtoken';

// This should be a strong secret key, keep it safe!
const secretKey = '123456'; // Replace with a strong secret

// Function to generate a token
export const generateToken = (user) => {
    return jwt.sign({ id: user.id, username: user.username }, secretKey, {
        expiresIn: '1h', // Token expires in 1 hour
    });
};

// Function to verify a token
export const verifyToken = (token) => {
    return jwt.verify(token, secretKey);
};
