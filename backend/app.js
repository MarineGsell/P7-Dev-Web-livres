// Importations
const express = require('express')
const mongoose = require('mongoose')
const userRoutes = require('./routes/user')
const bookRoutes = require('./routes/book')
const path = require('path')

const app = express()

// Connexion à la basede donnée 
mongoose.connect('mongodb+srv://marine:Paillette33@cluster0.jw9q2il.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    { useNewUrlParser: true,
      useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));  

// Traitement des requetes au format JSON
app.use(express.json());

// Middleware CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

// Gestion des images en statique
app.use('/images', express.static(path.join(__dirname, 'images')));

// Mise en place des routes
app.use('/api/books', bookRoutes)
app.use('/api/auth', userRoutes)

// Route par défaut
app.use((req, res) => {
    res.json({ message: 'votre requete a bien été recue' })
})

module.exports = app