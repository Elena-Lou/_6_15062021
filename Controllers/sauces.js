const Sauce = require("../models/sauce");

const fs = require("fs");

//création d'une sauce selon le modèle défini
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
  });

  sauce.save()

    .then(() => { res.status(201).json({ message: "sauce enregistrée" });
    })
    
    .catch(error =>  res.status(400).json({ error }));

};

//modification de la sauce avec ou sans modification du fichier image 
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
    {
        ...JSON.parse(req.body.sauce), 
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
    } : {...req.body};
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })

    .then(() => res.status(200).json({ message: "sauce mise à jour" }))

    .catch(error => res.status(400).json({ error }));
};

//suppression de la sauce avec suppression de l'image dans le fichier "images" 
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
    .then(sauce => {
        const filename = sauce.imageUrl.split("images/")[1];
        fs.unlink(`images/${filename}`, () => {

            Sauce.deleteOne({ _id: req.params.id })
          
              .then(() => res.status(200).json({ message: "sauce supprimée" }))
          
              .catch(error => res.status(400).json({ error }));
        });
    })
    .catch(error => res.status(500).json({ error }));

};

//récupération d'une sauce selon son id
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })

    .then(sauce => res.status(200).json(sauce))

    .catch(error => res.status(404).json({ error }));
};

//récupération de toutes les sauces créées
exports.getAllSauces = (req, res, next) => {
  Sauce.find()

    .then(sauces => res.status(200).json(sauces))

    .catch(error => res.status(400).json({ error }));
};

//affichage des opinions sur les sauces
exports.likeDislike = (req, res, next) => {
    let like = req.body.like;
    let userId = req.body.userId;
    let sauceId = req.params.id;

  if (like === 1) {
  
    Sauce.updateOne(
      { _id: sauceId },
      {
        $push: { usersLiked: userId,},
        $inc: { likes: +1, }, 
      }
    )
      .then(() => res.status(200).json({ message: "j'aime !" }))

      .catch(error => res.status(400).json({ error, }));
  }

  if (like === -1) {
    Sauce.updateOne(
      { _id: sauceId },
      {
        $push: { usersDisliked: userId },
        $inc: { dislikes: +1  }
      }
    )
      .then(() => { res.status(200).json({ message: "je n'aime pas !" })})

      .catch(error =>  res.status(400).json({ error, }));
  }
  if (like === 0) {
    
    Sauce.findOne({ _id: sauceId })
      .then((sauce) => {  if (sauce.usersLiked.includes(userId)) {
          
          Sauce.updateOne(
            { _id: sauceId },
            {
              $pull: { usersLiked: userId },
              $inc: {  likes: -1 }
            }
          )
            .then(() => res.status(200).json({ message: "indécis.e !" }))

            .catch(error => res.status(400).json({ error }));
        }
        if (sauce.usersDisliked.includes(userId)) {
          
          Sauce.updateOne(
            { _id: sauceId },
            {
              $pull: { usersDisliked: userId },
              $inc: { dislikes: -1 }
            }
          )
            .then(() => res.status(200).json({ message: "indécis.e" }))

            .catch(error => res.status(400).json({ error }));
        }
      })

      .catch(error => res.status(404).json({ error }));
  }
};