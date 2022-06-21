// Rutas para crear usuarios 
const express = require('express');
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");
const { check } = require('express-validator');


//Crear un usuario
// api/usuarios
router.post('/', [
    check('name', 'El nombre es obligatorio').not().isEmpty(), //.not.isEmpty() QUE NO ESTE VACIO. 
    check('email', 'Agrega un Email Valido').isEmail(), // isEmail() QUE SEA DE TIPO EMAIL.
    check('password', 'El password debe tener un minimo de 6 caracteres').isLength({min: 6}), // .isLength() QUE TENGA COMO MINIMO.
],
    usuarioController.crearUsuario
) // método para crear usuarios.

router.get('/', usuarioController.obtenerUsuarios) // método para traer la lista de usuarios. 
router.get('/:id', usuarioController.obtenerUsuario) // metodo para encontrar un usuario en particular.
router.put('/:id', usuarioController.modificarUsuario) // metodo para encontrar un usuario en particular y actualizar sus datos.  
router.delete('/:id', usuarioController.borrarUsuario) // metodo para encontrar un usuario y borrarlo.
module.exports = router;