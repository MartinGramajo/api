const Usuario = require("../Models/Usuario");
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');

exports.crearUsuario = async (req, res) => {
    // Revisamos los errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ msg: errores.array() })
    }

    const { email, password } = req.body;

    try {
        // VALIDACIÓN: Revisando que el email sea único. 
        let usuarioEncontrado = await Usuario.findOne({ email });

        if (usuarioEncontrado) {
            return res.status(400).send("Email ya esta en uso")
        }

        let usuario;

        //nuevo usuario
        usuario = new Usuario(req.body); // vamos a crear un usuario de type USUARIO (es decir, por type USUARIO nos referimos al modelo USUARIO que hemos creado en Usuario.js) tomando los valors de req.body.

        // hashear el password
        const salt = await bcryptjs.genSalt(10); //genSalt es la cantidad de veces que se va a repetir el algoritmo para ocultar nuestro password.
        usuario.password = await bcryptjs.hash(password, salt); // tomamos el password del usuario y lo reescribimos con el scrytador. 

        //guardar usuario
        await usuario.save(); // .save() es una función de Mongo.

        //Mensaje de exito 
        res.send("Usuario creado Correctamente"); // utilizamos el res para enviar una mensaje. 
    } catch (error) {
        console.log(error);
        res.status(400).send("Hubo un error")
    }
};
// Obtener lista de usuarios
exports.obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.find();
        res.send(usuarios)
    } catch (error) {
        res.status(400).send("Hubo un error en la conexión a la base de datos")
    }
}
// Obtener un usuario en singular
exports.obtenerUsuario = async (req, res) => {
    try {
        const usuarios = await Usuario.findById(req.params.id).select('name email');
        res.send(usuarios)
    } catch (error) {
        res.status(400).send("Hubo un error en la conexión a la base de datos")
    }
}
// Modificar el nombre del usuario
exports.modificarUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id);
        // condición: si en body no viene una propiedad "name" vamos a devolverlo como un error. 
        if (!req.body.name) {
            return res.status(404).send("Dato de nombre incompleto")
        }
        // Porque para actualizar un usuario si o si queremos que venga un valor nuevo en name. 
        usuario.name = req.body.name;
        await usuario.save();
        res.send(usuario)
    } catch (error) {
        res.status(400).send("Hubo un error en la conexión a la base de datos")
    }
}
// Borrar un usuario en singular
exports.borrarUsuario = async (req, res) => {
    try {
        await Usuario.findById(req.params.id)
        res.send("usuario eliminado")
    } catch (error) {
        res.status(400).send("Hubo un error en la conexión a la base de datos")
    }
}