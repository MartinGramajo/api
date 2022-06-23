// Rutas para crear usuarios 
const express = require('express');
const router = express.Router();
const authController = require("../controllers/authController");
const { check } = require('express-validator');


// Registro de Usuarios
router.post('/register', [
    check('name', 'El nombre es obligatorio').not().isEmpty(), //.not.isEmpty() QUE NO ESTE VACIO. 
    check('email', 'Agrega un Email Valido').isEmail(), // isEmail() QUE SEA DE TIPO EMAIL.
    check('password', 'El password debe tener un minimo de 6 caracteres').isLength({ min: 6 }), // .isLength() QUE TENGA COMO MINIMO.
],
    authController.registrar
) 

// Login(generando token)
router.post('/login', [
    check('email', 'Agrega un Email Valido').isEmail(), // 
    check('password', 'El password debe tener un minimo de 6 caracteres').isLength({ min: 6 }), // .isLength() QUE TENGA COMO MINIMO.
    ],
    authController.login
)

//Obtener usuario autenticado (Trabajando con el token recibido).
router.get('/', authController.obtenerUsuarioAutenticado);
module.exports = router;