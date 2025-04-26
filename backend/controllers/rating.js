const Book = require('../models/Book')

exports.ratingBook = (req, res, next) => {
    // Récupération de la note
    const ratingValue = Number(req.body.rating)

    if(isNaN(ratingValue) || ratingValue < 0 || ratingValue > 5 ){
        return res.status(500).json({ message: 'La note doit être comprise entre 1 et 5' })
    }

    // Récupération du livre
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            // On compare les userId
            const existingRating = book.ratings.find(rating => rating.userId === req.auth.userId)
            if(existingRating){
                return res.status(403).json({ message: 'Vous avez déjà noté ce livre' })
            } else {
                // On ajoute la note
                book.ratings.push({
                    userId: req.auth.userId,
                    grade: ratingValue
                })
            }
            // On met à jour la moyenne
            const initialValue = 0
            const sumRatings = book.ratings.reduce((accumulator, currentValue) => accumulator + currentValue.grade, initialValue)
            book.averageRating = sumRatings / book.ratings.length
            
            // On sauvegarde
            book.save()
                .then(updateBook => res.status(200).json( updateBook ))
                .catch(error => res.status(400).json({ error }))
        })
        .catch(error => res.status(404).json({ error }))
}

exports.bestRatings = (req, res, next) => {
    Book.find().sort({ averageRating: -1 }).limit(3)
        .then(books => res.status(200).json(books))
        .catch(error => res.status(400).json({ error }))
}

