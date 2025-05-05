const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const { createSecretToken } = require("../token/generateToken");

function isHashed(password) {
    return typeof password === 'string' && password.startsWith("$2") && password.length === 60;
}

// Crear un nuevo usuario
exports.createUserController = async (req, res) => {
    try {
        const {
            first_name,
            last_name,
            email,
            password,
            phone,
            role,
            address
        } = req.body;

        const existingUser = await User.findOne({ $or: [{ email }, { phone }] });

        if (existingUser) {
            if (existingUser.email === email) {
                return res.status(400).json({ message: "El correo ya está en uso" });
            }
            if (existingUser.phone === phone) {
                return res.status(400).json({ message: "El teléfono ya está en uso" });
            }
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new User({
            first_name,
            last_name,
            email,
            password: hashedPassword,
            phone,
            role,
            address: {
                street: address.street,
                city: address.city,
                state: address.state,
                zip: address.zip
            },
            created_at: new Date()
        });

        const savedUser = await newUser.save();

        res.status(201).json({ message: "Usuario creado exitosamente", user: savedUser });
    } catch (error) {
        res.status(500).json({ message: "Error al crear usuario", error });
    }
};

exports.getUserController = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({ message: "Usuarios obtenidos exitosamente", users });
    } catch (error) {
        res.status(500).json({ message: "Error al obtener usuarios", error });
    }
};

exports.getUserByIdController = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.status(200).json({ message: "Usuario obtenido exitosamente", user });
    } catch (error) {
        res.status(500).json({ message: "Error al obtener usuario", error });
    }
};

exports.updateRoleController = async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    try {
        const user = await User.findByIdAndUpdate(id, { role }, { new: true });
        res.json({ message: "Rol actualizado", user });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el rol", error });
    }
};

exports.deleteUserController = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findByIdAndDelete(id);
        res.json({ message: "Usuario eliminado", user });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar usuario", error });
    }
};

exports.createMultipleUsersController = async (req, res) => {
    const usersData = req.body.users;

    if (!Array.isArray(usersData) || usersData.length === 0) {
        return res.status(400).json({ message: "Se requiere un arreglo de usuarios" });
    }

    const results = {
        success: [],
        ignored: [],
    };

    for (const userData of usersData) {
        const {
            first_name,
            last_name,
            email,
            password,
            phone,
            role,
            address
        } = userData;

        try {
            const existingUser = await User.findOne({ $or: [{ email }, { phone }] });

            if (existingUser) {
                results.ignored.push({ email });
                continue;
            }

            let finalPassword = password;

            if (!isHashed(password)) {
                const saltRounds = 10;
                finalPassword = await bcrypt.hash(password, saltRounds);
            }

            const newUser = new User({
                first_name,
                last_name,
                email,
                password: finalPassword,
                phone,
                role,
                address: {
                    street: address.street,
                    city: address.city,
                    state: address.state,
                    zip: address.zip,
                },
                created_at: new Date()
            });

            await newUser.save();
            results.success.push({ email });
        } catch (error) {
            console.error(`Error al procesar el usuario ${email}:`, error.message);
        }
    }

    res.status(201).json({
        message: "Proceso de importación finalizado",
        totalUploaded: usersData.length,
        ignoredCount: results.ignored.length,
        results
    });
};
