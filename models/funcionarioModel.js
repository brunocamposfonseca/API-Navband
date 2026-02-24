const { default: mongoose } = require("mongoose");

const Schema = mongoose.Schema;

const funcionarioSchema = new Schema({
    _id: { type: String,required: true },//uuid
    email: { type: String, required: true },
    telefone: { type: String, required: true },
    cargo: {
        type: String,
        enum: ['ADMIN', 'GUICHE', 'GESTAO'],
        required: true
    },
    cpf: {type: String, ref: 'usuario', required: true},
    auth: {type: String, ref: 'login',required: true}
    
}, { versionKey: false })

const FuncionarioModel = mongoose.model('funcionario', funcionarioSchema);

module.exports = FuncionarioModel;