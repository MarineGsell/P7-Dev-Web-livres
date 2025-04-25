const multer = require('multer')
const sharp = require('sharp')
const fs = require('fs')
const path = require('path')
const { error } = require('console')

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
}

// Configuration du stockage temporaire pour l'upload
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images/temp')
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_')
        const extension = MIME_TYPES[file.mimetype]
        callback(null, name + Date.now() + '.' + extension)
    }
})

// Middleware Multer de base
const upload = multer({ storage }).single('image')

// Middleware de compression d'image
const compressImage = (req, res, next) => {
    if(!req.file){
        return next()
    }
    const filePath = req.file.path
    const fileName = path.basename(filePath)
    const outputPath = `images/${fileName}`

    // Compression avec Sharp
    sharp(filePath)
        .webp({ quality: 80 })
        .toFile(outputPath)
        .then(() => {
            // Supprime le fichier original
            fs.unlinkSync(filePath)

            // Met à jour le chemin du fichier dans req.file
            req.file.path = outputPath
            next()
        })
        .catch(error => res.status(400).json({ error }))
}

// Exporte un middleware qui combine l'upload et la compression

module.exports = (req, res, next) => {
    upload(req, res, (error) => {
        if(error){
            return next(error)
        }
        compressImage(req, res, next)
    })
}