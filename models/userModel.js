
const { default: mongoose } = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    _id: { type: String, required: true },//cpf
    nome: { type: String, required: true },
    dataNasc: { type: Date, required: true },
    sexo: {
        type: String,
        enum: ['M', 'F', 'N'],
        required: true
    },
    //email: { type: String, required: true }
}, {timestamps: true ,versionKey: false })

const UserModel = mongoose.model('usuario', UserSchema);

module.exports = UserModel;