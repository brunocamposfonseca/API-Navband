const { default: mongoose } = require("mongoose");

const Schema = mongoose.Schema;

const dependenteSchema = new Schema({
    _id: {type: String, required: false},//uuid
    autorizacao: {
        type: String,
        enum: ['VERMELHO', 'AMARELO', 'AZUL', 'VERDE'],
    },
    cpf: {type: String, ref: "usuario", required: true}
}, { versionKey: false })

const DependenteModel = mongoose.model('dependente', dependenteSchema);

module.exports = DependenteModel;