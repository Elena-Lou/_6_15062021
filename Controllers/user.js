const User = require("../models/user");

const bcrypt = require("bcrypt");
const jwt = require ("jsonwebtoken");

const dotenv = require("dotenv");
dotenv.config();

//creation d'utilisateur et cryptage du mot de passe
exports.signup = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)

    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });

      user.save()
        .then(() => res.status(201).json({ message: "utilisateur créé" }))

        .catch(error => res.status(400).json({ error }));
    })

    .catch(error => res.status(500).json({ error }));
};

//connexion de l'utilisateur et comparaison des chaînes de caractères des mdp cryptés
exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })

    .then((user) => {

      if (!user) {
        return res.status(401).json({ message: "utilisateur inconnu" });

      } bcrypt.compare(req.body.password, user.password)

        .then(valid => {

          if (!valid) {
            return res.status(401).json({ message: "mot de passe erronné" });
          } res.status(200).json({
            userId: user._id,
            token: jwt.sign( //création d'un token unique pour authentifier les requêtes
                {userId: user._id},
                process.env.TOKEN,
                {expiresIn: "24h"}
            )
          });
        })

        .catch(error => res.status(500).json({ error }));
    })

    .catch(error => res.status(500).json({ error }));
};