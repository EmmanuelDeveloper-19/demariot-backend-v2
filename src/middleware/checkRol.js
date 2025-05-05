const User = require("../models/User");

const checkRol = (roles) =>
{
    return async (req, res, next)=>
    {
        try
        {
            const user = await User.findById(req.user.id);
            if(!user) return res.status(404).json({message: "Usuario no encontrado pipip"});

            if(!roles.includes(user.role))
            {
                return res.status(403).json({message: "No puedes acceder a esto simio"});
            }

            next();
        }
        catch(error)
        {
            res.status(500).json({message: "Error de autorización pa", error});
        }
    };
};

module.exports = checkRol;