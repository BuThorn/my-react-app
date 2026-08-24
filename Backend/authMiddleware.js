const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key';

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader) {
        return res.status(403).json({ message: 'តម្រូវឲ្យមាន Token ដើម្បីចូល' });
    }

    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : authHeader.trim();

    if (!token) {
        return res.status(401).json({ message: 'Token មិនត្រឹមត្រូវ ឬហួសកំណត់' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        return next();
    } catch (error) {
        return res.status(401).json({ message: 'Token មិនត្រឹមត្រូវ ឬហួសកំណត់' });
    }
};

module.exports = { verifyToken };
