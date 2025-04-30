// Importations
const express = require('express')
const bookCtrl = require('../controllers/book')
const ratingCtrl = require('../controllers/rating')
const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')

const router = express.Router()

// Routes
router.post('/', auth, multer, bookCtrl.createBook)
router.get('/', bookCtrl.getAllBook)
router.get('/bestrating', ratingCtrl.bestRatings)
router.get('/:id', bookCtrl.getOneBook)
router.put('/:id', auth, multer, bookCtrl.modifyBook)
router.delete('/:id', auth, bookCtrl.deleteBook)
router.post('/:id/rating', auth, ratingCtrl.ratingBook)

module.exports = router
