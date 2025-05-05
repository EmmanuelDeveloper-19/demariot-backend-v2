const app = require("./src/app");
const Connection = require("./src/database/db");

const PORT = 8000;

Connection();

app.listen(PORT, () => {
    console.log(`El servidor se está ejecutando en el puerto ${PORT}`);
})