const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    try {
        // Récupération du TOKEN
        const token = req.headers.authorization.split(' ')[1]
        // Vérification du TOKEN valide
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET')
        // Récupération de l'ID 
        const userId = decodedToken.userId
        req.auth = {
            userId: userId
        }
        next()
    } catch (error) {
        res.status(401).json({error})
    }
}