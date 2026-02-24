const { default: mongoose } = require("mongoose");

const Schema = mongoose.Schema;

const responsavelSchema = new Schema({
    _id: { type: String, required: true },//uuid
    email: {type: String, required: true},
    telefone: { type: String, required: true },
    cpf: {type: String, ref: 'usuario',required: true},
    auth: {type: String, ref:'login', required: true}
}, { versionKey: false })

const ResponsavelModel = mongoose.model('responsaveis', responsavelSchema);

module.exports =  ResponsavelModel;