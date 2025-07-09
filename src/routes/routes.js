
const express = require("express");
const path = require("path");

const verifyToken = require("../middleware/verifyToken");
const checarRol = require("../middleware/checkRol");

/*========== Importación de los controladores ============= */
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const phSensorController = require("../controllers/phSensorController");
const turbidezSensorController = require("../controllers/turbidezSensorController");
const tempSensorController = require("../controllers/tempSensorController");
const humiditySensorController = require("../controllers/humiditySensorController");
const colorimetrySensorController = require("../controllers/colorimetrySensorController");
const prototypeController = require("../controllers/prototypeController");
const muestraController = require("../controllers/muestraController");
const predictionController = require("../controllers/predictionController");
const upload = require("../config/multerConfig");

const router = express.Router();
const User = require("../models/User");

/*========== Rutas de autenticación ============= */
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.put("/updateUser/:id", verifyToken, upload.single("profile_picture"), authController.updateUser);    
router.put("/changePassword/:id", verifyToken, authController.changePassword);
router.post("/recovery-password", authController.recoverPassword);

/*========== Rutas de usuarios ============= */
router.post("/create-user", verifyToken, checarRol(["admin"]), userController.createUserController);
router.post("/create-users", verifyToken, checarRol(["admin"]), userController.createMultipleUsersController);
router.put("/update-user/:id", verifyToken, checarRol(["admin"]), userController.updateRoleController);
router.get("/get-users", verifyToken, checarRol(["admin"]), userController.getUserController);
router.get("/get-user/:id", verifyToken, checarRol(["admin"]), userController.getUserByIdController);
router.delete("/delete-users/:id", verifyToken, checarRol(["admin"]), userController.deleteUserController);

// Ruta para obtener la foto de perfil del usuario
router.get("/users/:id/photo", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        console.log("Usuario encontrado:", user);

        if (!user || !user.profile_picture) {
            return res.status(404).json({ message: "Imagen no encontrada" });
        }

        const filePath = path.join(__dirname, "../../public", user.profile_picture);
        console.log("Ruta del archivo:", filePath);

        res.sendFile(filePath);
    } catch (error) {
        console.error("Error al obtener la foto:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
});

/* ============================================================ */
/* ========= Rutas para obtener datos de sensores ============= */
/* ============================================================ */
router.post("/create-ph-sensor", phSensorController.create);
router.get("/get-ph-sensor", phSensorController.get);
router.post("/create-turbidez-sensor", turbidezSensorController.create);
router.get("/get-turbidez-sensor", turbidezSensorController.get);
router.post("/create-colorimetry-sensor", colorimetrySensorController.create);
router.get("/get-colorimetry-sensor", colorimetrySensorController.get);
router.post("/create-temp-sensor", tempSensorController.create);
router.get("/get-temp-sensor", tempSensorController.get);
router.post("/create-humidity-sensor", humiditySensorController.create);
router.get("/get-humidity-sensor", humiditySensorController.get);
router.post("/create-prototype", prototypeController.create);
router.get("/get-prototype", prototypeController.get);
router.post("/create-muestra", muestraController.create);
router.get("/get-muestra", muestraController.get);
router.post("/create-prediction", predictionController.create);
router.post("/create-many-prediction", predictionController.createMany);
router.get("/get-prediction", predictionController.get);


module.exports = router;

