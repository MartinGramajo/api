const Usuario = require("../Models/Usuario");
const bcryptjs = require('bcryptjs');
const {validationResult} = require('express-validator');

exports.crearUsuario = async (req, res) => {
    // Revisamos los errores
    const errores = validationResult(req); 
    if (!errores.isEmpty()) {
        return res.status(400).json({msg: errores.array()})
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
exports.obtenerUsuarios = (req, res) => {
    console.log('Funcion para obtener usuarios');
    res.status(200).send("Lista de usuarios")
}
// Obtener un usuario en singular
exports.obtenerUsuario = (req, res) => {
    console.log('usuario encontrado', req.params);
    res.status(200).send("usuario encontrado")
}
// Obtener un usuario y actualizar sus datos
exports.modificarUsuario = (req, res) => {
    console.log('usuario encontrado para modificar', req.params);
    res.status(200).send("usuario Modificado")
}
// Borrar un usuario en singular
exports.borrarUsuario = (req, res) => {
    console.log('usuario borrado', req.params);
    res.status(200).send("usuario encontrado para  borrado")
}