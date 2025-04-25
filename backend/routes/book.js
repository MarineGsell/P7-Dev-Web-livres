const express = require('express')
const bookCtrl = require('../controllers/book')
const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')

const router = express.Router()

router.post('/', auth, multer, bookCtrl.createBook)

router.get('/', bookCtrl.getAllBook)

router.get('/:id', bookCtrl.getOneBook)

router.put('/:id', auth, multer, bookCtrl.modifyBook)

router.delete('/:id', auth, bookCtrl.deleteBook)

module.exports = router
