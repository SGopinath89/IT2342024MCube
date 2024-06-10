const jwt = require('jsonwebtoken');

const fetchadmin = async (req, res, next) => {
    const token = req.header('admin-auth-token'); // Use a different header for admin tokens
    if (!token) {
        return res.status(401).json({ errors: "Please authenticate using a valid admin token" });
    }

    try {
        const data = jwt.verify(token, 'admin_secret_mcube'); // Use a different secret for admin tokens
        req.admin = data.admin; // Attach the admin data to the request object
        next();
    } catch (error) {
        console.error('Error verifying admin JWT token:', error);
        return res.status(401).json({ errors: "Please authenticate using a valid admin token" });
    }
};

module.exports = { fetchadmin };
