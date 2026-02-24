const {default: mongoose, mongo} = require('mongoose')

const Schema = mongoose.Schema

const AcessoSchema = new Schema({
    _id: {type: String, required: true},//tfcode
    coordenadas: {type: {
            type: String,
            enum: ['Point'],
            required: true
        }, coordinates: {
            type: [Number],
            required: true
        }},
    id_depRes: {type: String, ref: 'dependenteResponsavel'}
})

const AcessoModel = mongoose.model("acesso", AcessoSchema)

module.exports = AcessoModel