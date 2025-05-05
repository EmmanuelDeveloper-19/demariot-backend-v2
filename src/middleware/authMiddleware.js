const jwt = require("jsonwebtoken");
const User = require("../schema/Schema");

const verifyToken = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Acceso denegado. Token no proporcionado." });
    }

    try {
        // Usamos la misma clave secreta que en createSecretToken
        const decoded = jwt.verify(token, process.env.TOKEN_KEY);
        const user = await User.findById(decoded.id);
        
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        req.user = {
            id: user._id,
            email: user.email,
            role: user.role
        };
        
        next();
    } catch (error) {
        return res.status(401).json({ message: "Token inválido", error: error.message });
    }
};

module.exports = { verifyToken };