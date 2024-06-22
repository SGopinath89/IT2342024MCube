//middleware for fetch user

const jwt = require('jsonwebtoken');

const fetchuser = async (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        return res.status(401).json({ errors: "Please authenticate using a valid token" });
    }

    try {
        const data = jwt.verify(token, 'secret_mcube');
        req.user = data.user;
        next();
    } catch (error) {
        console.error('Error verifying JWT token:', error);
        return res.status(401).json({ errors: "Please authenticate using a valid token" });
    }
};

module.exports = { fetchuser };
