// Rutas para memes
const express = require('express');
const router = express.Router();
const memeControllers = require('../controllers/memeController');


router.post('/', memeControllers.crearMeme); // Para crear meme.
router.get('/', memeControllers.obtenerMemes); // Listar memes.
router.get('/:id', memeControllers.obtenerMeme); // Buscar un meme en especifico con su id.
router.put('/:id', memeControllers.modificarMeme); // Modificar meme.
router.delete('/:id', memeControllers.borrarMeme); // Eliminar meme. Validar creador antes de eliminar. 
module.exports = router;