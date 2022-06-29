const jwt = require('jsonwebtoken');
const Meme = require("../models/Meme");

exports.crearMeme = async (req, res) => {
    try {
        // LEER TOKEN que debería venir en el header de la request
        // y lo guardamos en una variable. 
        const token = req.header('x-auth-token');

        // REVISAR TOKEN (validamos que exista un token, que el dato token no venga vacío)
        if (!token) {
            return res.status(401).json({ msg: 'No hay Token, permiso no valido' })
        }

        // VERIFICACIÓN DEL TOKEN: para extraer la id del usuario (cifrado.usuario.id)
        const cifrado = jwt.verify(token, process.env.SECRETA);

        //Nuevo Meme 
        const meme = new Meme({ ...req.body, creador: cifrado.usuario.id });
        meme.fecha = new Date();
        // Guardar Meme
        await meme.save();
        // respuesta 
        res.send("Meme creado Correctamente")
    } catch (error) {
        console.log(error);
        res.status(400).send("Hubo un error")
    }
}

exports.obtenerMemes = async (req, res) => {
    try {
        const memes = await Meme.find().populate({ path: 'creador', select: 'name' });
        res.send(memes)
    } catch (error) {
        console.log(error);
        res.status(400).send("Hubo un error")
    }
}

exports.obtenerMeme = async (req, res) => {
    try {
        // creamos  una variable para guardar el meme.
        // a nuestro modelo Meme le aplicamos la funcion para buscar por id (findById). 
        // por paramentro le pasamos req.params.id (es la informacion de la ruta que esta despues de api/memes/"id").
        const meme = await Meme.findById(req.params.id)
        res.send(meme);
        console.log("meme obtenido")
    } catch (error) {
        console.log(error);
        res.status(400).send("Hubo un error")
    }
}

exports.modificarMeme = async (req, res) => {
    try {
        // Buscamos cual es el meme que queremos modificar. 
        const meme = await Meme.findById(req.params.id);
        // VALIDACIÓN(evitar actualizar nuestra base de dato con datos vacios)
        // hasOwnProperty() metodo que tienen todos los objetos
        // con el que podemos revisar si el objeto tiene esa propiedad. 
        // y si enviamos o modificamos algo con una propiedad  vacia no va actualizar nuestra base de datos 
        if (req.body.hasOwnProperty('titulo')) {
            meme.titulo = req.body.titulo;
        }
        if (req.body.hasOwnProperty('imagen')) {
            meme.imagen = req.body.imagen;
        }
        // if (req.body.hasOwnProperty('titulo') || req.body.hasOwnProperty('imagen')) {
        //     meme.titulo = req.body.titulo;
        //     meme.imagen = req.body.imagen;
        // }
        meme.save();
        res.send(meme);
        console.log("meme actualizado")
    } catch (error) {
        console.log(error);
        res.status(400).send("Hubo un error")
    }
}


exports.borrarMeme = async (req, res) => {
    try {
        // AWAIT porque es una promesa.
        // para borrar se utiliza el metodo findByIdAndDelete() busca el id q pasamos por parametro y lo borra. 
        await Meme.findByIdAndDelete(req.params.id)
        res.send("Meme eliminado");
        console.log("meme borrado");
    } catch (error) {
        console.log(error);
        res.status(400).send("Hubo un error")
    }
}
