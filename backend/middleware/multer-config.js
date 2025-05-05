const multer = require('multer')
const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

// Vérifier si le dossier images existe, sinon le créer
if (!fs.existsSync('images')) {
    fs.mkdirSync('images', { recursive: true })
}

// Configuration du stockage pour multer
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() 
        const extension = file.mimetype.split('/')[1]
        callback(null, uniqueSuffix + '.' + extension)
    }
});

// Créer une instance de multer configurée
const upload = multer({ storage: storage })

// Middleware pour la conversion en WebP
const processImage = async (req, res, next) => {
    // Si pas de fichier, passer au suivant
    if (!req.file) {
        return next()
    }
    
    try {
        // Chemin du fichier d'origine
        const originalPath = req.file.path
        
        // Créer le nom du fichier WebP
        const filename = path.parse(req.file.filename).name
        const webpFilename = `${filename}.webp`
        const webpPath = `images/${webpFilename}`
                
        // Conversion avec Sharp
        await sharp(originalPath)
            .webp({ quality: 80 })
            .toFile(webpPath)
                
        // Supprimer le fichier original
        fs.unlinkSync(originalPath)
        
        // Mettre à jour les informations du fichier
        req.file.filename = webpFilename
        req.file.path = webpPath
        req.file.mimetype = 'image/webp'
        
        next()
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
};

// Exporter une fonction qui retourne le middleware
module.exports = (req, res, next) => {        
    upload.single('image')(req, res, (err) => {
        if (err) {
            return res.status(400).json({ error: err.message })
        }
        
        // Après le téléchargement réussi, procéder à la conversion
        processImage(req, res, next)
    })
}
