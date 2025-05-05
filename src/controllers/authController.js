const User = require("../models/User");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const { createSecretToken } = require("../token/generateToken");
const sendMail = require("../../public/utils/sendMail");

// Utilidades
function generateRandomPassword(length = 8) {
    return crypto.randomBytes(length).toString('base64').slice(0, length);
}

function renderTemplate(templatePath, variables){
    let template = fs.readFileSync(templatePath, "utf8");
    for (const key in variables){
        template = template.replace(new RegExp(`{{${key}}}`, "g"), variables[key]);
    } 
    return template;
}

// Controllers
exports.signup = async (req, res) => {
    try {
        const { first_name, last_name, email, password, phone, role, address } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            first_name,
            last_name,
            email,
            password: hashedPassword,
            phone,
            role,
            address,
            created_at: new Date(),
            updated_at: new Date(),
            last_login: null,
            profile_picture: ""
        });

        await newUser.save();

        const token = createSecretToken(newUser._id);
        res.cookie("token", token, {
            path: "/",
            expires: new Date(Date.now() + 86400000),
            secure: true,
            httpOnly: true,
            sameSite: "None"
        });

        res.status(201).json({ user: newUser, token });
    } catch (error) {
        res.status(500).json({ message: error.message || "Internal server error" });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!(email && password)) {
        return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    user.last_login = Date.now();
    await user.save();

    const token = createSecretToken(user._id);
    res.cookie("token", token, {
        path: "/",
        expires: new Date(Date.now() + 86400000),
        secure: true,
        httpOnly: true,
        sameSite: "None"
    });

    res.json({ user, token });
};

exports.logout = (req, res) => {
    res.clearCookie("token", {
        path: "/",
        secure: true,
        httpOnly: true,
        sameSite: "None"
    });
    res.status(200).json({ message: "Logout successful" });
};

exports.updateUser = async (req, res) => {
    const userId = req.params.id;
    const { first_name, last_name, email, phone, address } = req.body;
    const file = req.file;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (email && email !== user.email) {
        const emailExist = await User.findOne({ email });
        if (emailExist) return res.status(409).json({ message: "Email already in use" });
    }

    Object.assign(user, { first_name, last_name, email, phone });

    let parsedAddress = address;
    if (typeof address === "string") {
        try { parsedAddress = JSON.parse(address); } 
        catch {
            return res.status(400).json({ message: "Invalid address format" });
        }
    }

    if (parsedAddress) Object.assign(user.address, parsedAddress);

    if (file) {
        if (user.profile_picture) {
            const oldImage = path.join(__dirname, "..", "uploads", path.basename(user.profile_picture));
            fs.existsSync(oldImage) && fs.unlinkSync(oldImage);
        }
        user.profile_picture = `/uploads/${file.filename}`;
    }

    user.updated_at = new Date();
    await user.save();

    res.status(200).json({ success: true, message: "User updated", user });
};

exports.changePassword = async (req, res) => {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) return res.status(403).json({ message: "Current password incorrect" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password updated successfully" });
};

exports.recoverPassword = async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Email not found" });

    const newPassword = generateRandomPassword();
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    const html = renderTemplate(
        path.join(__dirname, "../../public/template/emailMessage.html"),
        { first_name: user.first_name, password: newPassword }
    );

    await sendMail({
        to: email,
        subject: "Password Recovery",
        html
    });

    res.status(200).json({ message: "Recovery email sent" });
};
