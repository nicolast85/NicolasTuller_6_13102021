const Sauce = require('../models/sauce');
// Import du package "file system" de Node :
// donne accès aux fonctions qui nous permettent de modifier le système de fichiers, y compris aux fonctions 
// permettant de supprimer les fichiers.
const fs = require('fs');

// Nous utilisons la méthode find() dans notre modèle Mongoose afin de renvoyer un tableau contenant 
// toutes les Sauces dans notre base de données.
exports.getAllSauces = (req, res, next) => {
  Sauce.find().then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

// Nous utilisons la méthode get() pour répondre uniquement aux demandes GET à cet endpoint ;
// nous utilisons deux-points : en face du segment dynamique de la route pour la rendre accessible en tant 
// que paramètre ;
// nous utilisons ensuite la méthode findOne() dans notre modèle Sauce pour trouver la Sauce unique ayant 
// le même _id que le paramètre de la requête ;
// cette Sauce est ensuite retourné dans une Promise et envoyé au front-end ;
// si aucune Sauce n'est trouvé ou si une erreur se produit, nous envoyons une erreur 404 au front-end, 
// avec l'erreur générée.
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id
  }).then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

// Pour ajouter un fichier à la requête, le front-end doit envoyer les données de la requête sous la forme 
// form-data, et non sous forme de JSON. Le corps de la requête contient une chaîne sauce , qui est simplement 
// un objet sauce converti en chaîne. Nous devons donc l'analyser à l'aide de JSON.parse() pour obtenir un objet 
// utilisable.
// Nous devons également résoudre l'URL complète de notre image, car req.file.filename ne contient que le segment
// filename . Nous utilisons req.protocol pour obtenir le premier segment (dans notre cas 'http' ). Nous 
// ajoutons '://' , puis utilisons req.get('host') pour résoudre l'hôte du serveur (ici, 'localhost:3000' ). 
// Nous ajoutons finalement '/images/' et le nom de fichier pour compléter notre URL.
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    likes: 0,
    dislikes: 0,
    usersLiked: [' '],
    usersdisLiked: [' '],
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
    .catch(error => res.status(400).json({ error }));
};

// on crée un objet sauceObject qui regarde si req.file existe ou non. S'il existe, on traite la nouvelle image;
// s'il n'existe pas, on traite simplement l'objet entrant. On crée ensuite une instance Sauce à partir de 
// sauceObject , puis on effectue la modification.
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
    .catch(error => res.status(400).json({ error }));
};

// Nous utilisons l'ID que nous recevons comme paramètre pour accéder à la Sauce correspondante dans la base de
// données. Nous utilisons le fait de savoir que notre URL d'image contient un segment /images/ pour séparer 
// le nom de fichier. Nous utilisons ensuite la fonction unlink du package fs pour supprimer ce fichier, en lui
// passant le fichier à supprimer et le callback à exécuter une fois ce fichier supprimé ;
// dans le callback, nous implémentons la logique d'origine, en supprimant la Sauce de la base de données.
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

exports.likeDislikeSauce = (req, res, next) => {
  let like = req.body.like
  let userId = req.body.userId
  let sauceId = req.params.id
  
  switch (like) {
    case 1 :
        Sauce.updateOne({ _id: sauceId }, { $push: { usersLiked: userId }, $inc: { likes: +1 }})
          .then(() => res.status(200).json({ message: `J'aime` }))
          .catch((error) => res.status(400).json({ error }))
            
      break;

    case 0 :
        Sauce.findOne({ _id: sauceId })
           .then((sauce) => {
            if (sauce.usersLiked.includes(userId)) { 
              Sauce.updateOne({ _id: sauceId }, { $pull: { usersLiked: userId }, $inc: { likes: -1 }})
                .then(() => res.status(200).json({ message: `Suppression de J'aime` }))
                .catch((error) => res.status(400).json({ error }))
            }
            if (sauce.usersDisliked.includes(userId)) { 
              Sauce.updateOne({ _id: sauceId }, { $pull: { usersDisliked: userId }, $inc: { dislikes: -1 }})
                .then(() => res.status(200).json({ message: `Suppression de Je n'aime pas` }))
                .catch((error) => res.status(400).json({ error }))
            }
          })
          .catch((error) => res.status(404).json({ error }))
      break;

    case -1 :
        Sauce.updateOne({ _id: sauceId }, { $push: { usersDisliked: userId }, $inc: { dislikes: +1 }})
          .then(() => { res.status(200).json({ message: `Je n'aime pas` }) })
          .catch((error) => res.status(400).json({ error }))
      break;
      
      default:
        console.log(error);
  }
}