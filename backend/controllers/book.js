const Book = require('../models/Book')
const fs = require('fs');

exports.createBook = (req, res, next) => {
    // Parsage des données
    const bookObject = JSON.parse(req.body.book)
    delete bookObject._id
    delete bookObject._userId
    // Création du nouveau livre
    const book = new Book ({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    })
    book.save()
        .then(() => res.status(201).json({ message: 'livre enregistré' }))
        .catch(error => res.status(400).json({ error }))
}

exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then(book => res.status(200).json(book))
        .catch(error => res.status(404).json({ error }))
}

exports.getAllBook = (req, res, next) => {
    Book.find()
        .then(books => res.status(200).json(books))
        .catch(error => res.status(400).json({ error }))
}

exports.modifyBook = (req, res, next) => {
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body }
    delete bookObject._userId
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            // Vérification de l'ID
            if(book.userId !== req.auth.userId){
                res.status(403).json({ message: 'unauthorized request' })
            } 
            // Supression de l'ancienne image si nouvelle téléchargée
            if (req.file && book.imageUrl) {
                try {
                    const fileName = book.imageUrl.split('/images/')[1]
                    const filePath = `images/${fileName}`
                                        
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath)
                        console.log('Ancien fichier supprimé avec succès')
                    } else {
                        console.log('Ancien fichier introuvable')
                    }
                } catch (err) {
                    console.error('Erreur lors de la suppression:', err)
                }
            }
            Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
                .then( () => {
                    return res.status(200).json({ message: 'livre modifié' })
                })
                .catch(error => res.status(401).json({ error }))
            
        })
        .catch(error => res.status(400).json({ error }))
}

exports.deleteBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then(book => {
            // Vérification de l'ID
            if(book.userId !== req.auth.userId){
                res.status(403).json({ message: 'unauthorized request' })
            } else {
                // récupération du nom du fichier
                const filename = book.imageUrl.split('/images/')[1]
                // Supprime le fichier du serveur
                fs.unlink(`images/${filename}`, () => {
                    // Supprime e fichier de la base de donnée
                    Book.deleteOne({ _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'livre supprimé' }))
                        .catch(error => res.status(401).json({ error }))
                })
            }
        })
        .catch(error => res.status(500).json({ error }))
}