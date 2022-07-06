const Usuario = require("../Models/Usuario");
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.registrar = async (req, res) => {
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
        // Asegurando que el usuario creado en el registro publico
        //  siempre tenga el role de tipo user. 
        const bodyUsuario = { ...req.body, role: 'user' };
        // creamos un objeto nuevo que tenga todas las propiedades que tiene el objeto body
        // para ello usamos el spread syntax. 
        usuario = new Usuario(bodyUsuario);

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
// Login (generando el token y la verificaciones de los usuarios creados.)
exports.login = async (req, res) => {
    try {
        // revisamos los errores- agregamos validaciones. 
        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            return res.status(400).json({ msg: errores.array() });
        }
        const { email, password } = req.body; // desestructuramos el body

        //Revisar usuario registrado:Buscamos el usuario usando el email que extraemos de body. 
        const usuario = await Usuario.findOne({ email });
        //validación por si el usuario no existe 
        if (!usuario) {
            return res.status(400).json({ msg: 'El Usuario no existe' });
        }
        //Revisar el password: desescriptamos el password para utilizarlo en nuestra validación. 
        // funcion .compare(que recibe dos paramentros: 
        //1 - password: la contraseña que nos la envia el usuario (el la escribe). 
        //2 - usuario.password: la contraseña que esta encriptada. 
        // .compare()= compara ambas contraseña y nos devuelve un valor booleano.  
        // guardamos el resultado de la función en una variable. 
        // ademas es para saber si la contraseña es correcta. 
        const passCorrect = await bcryptjs.compare(password, usuario.password);
        if (!passCorrect) {
            return res.status(400).json({ msg: 'Password incorrecto' });
        }

        // Si todo es correcto Crear y firmar JWT

        // 1-por buenas practice creamos un objeto llamado payload(información importante)
        // 2- en ese objeto se guarda la propiedad usuario. 
        const payload = {
            usuario: {
                id: usuario.id,
                role: usuario.role,
            },
        };
        // metodo sign()
        jwt.sign(
            payload, // datos del usuario.
            process.env.SECRETA, // variable de entorno para no subirla a github(dato sensible).
            {
                expiresIn: 360000, //1 hora (3600)
            },
            (error, token) => {
                if (error) throw error; // throw: es nuestro return del error. lo capturamos para evitar propagarse. 
                res.json({ token, name: usuario.name, register: usuario.register }); // respuesta para el usuario. objeto con el token creado. 
            }
        );

    } catch (error) {
        res.status(400).send("Hubo un error en la conexión a la base de datos")
    }
}

//Función para recibir el token y devolver la información del usuario.
exports.obtenerUsuarioAutenticado = async (req, res) => {
    // LEER TOKEN 
    // header: otra parte de la request donde podemos enviar datos. 
    const token = req.header('x-auth-token');

    // REVISAR TOKEN (validamos que el token no venga vacío)
    if (!token) {
        return res.status(401).json({ msg: 'No hay Token, permiso no valido' })
    }

    // Validar Token(por si el codigo puede fallar lo envolvemos en el bloque try/catch)
    // el permiso seria validar al usuario para poder ver su información. 
    try {
        const cifrado = jwt.verify(token, process.env.SECRETA);
        // para encontrar al usuario encontrado.
        const usuario = await Usuario.findById(cifrado.usuario.id).select('name role email'); 
        res.send(usuario);
    } catch (error) {
        console.error(error);
        res.status(401).json({ msg: 'Token no valido' })
    }
    res.send(token);
}