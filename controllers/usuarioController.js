const Usuario = require("../Models/Usuario")

exports.crearUsuario = async (req, res) => {
    try {
        let usuario; 

        //nuevo usuario
        usuario = new Usuario(req.body); // vamos a crear un usuario de type USUARIO (es decir, por type USUARIO nos referimos al modelo USUARIO que hemos creado en Usuario.js) tomando los valors de req.body.

        //guardar usuario
        await usuario.save(); // .save() es una función de Mongo.

        //Mensaje de exito 
        res.send("Usuario creado Correctamente"); // utilizamos el res para enviar una mensaje. 

    } catch (error) {
        console.log(error);
        res.status(400).send("Hubo un error")
    }
};