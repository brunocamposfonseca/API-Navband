const {default: mongoose} = require("mongoose")

const Schema = mongoose.Schema

const LoginSchema = new Schema({
    _id: {type: String, required: true}, //uuid
    senha: {type: String, required: false},
    auth: {type: String, enum: ['CREDENTIALS', 'SOCIAL'], default: 'CREDENTIALS'},
},{timestamps: true, versionKey: false})

const LoginModel = mongoose.model("login", LoginSchema)

module.exports = LoginModel