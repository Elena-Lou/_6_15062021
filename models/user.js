const mongoose = require("mongoose");

const uniqueValidator = require("mongoose-unique-validator");


//création d'un objet modèle pour l'utilisateur
const userSchema = mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true}
});

//adresse mail unique pour chaque utilisateur
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
