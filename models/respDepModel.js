const {default: mongoose} = require("mongoose")

const Schema = mongoose.Schema

const RespDepSchema = new Schema({
    _id: {type: String, required: true}, 
    id_responsavel: {type: String, required: true},
    id_dependente: {type: String,  required: true}
},{timestamps: true, versionKey: false})

const RespDepModel = mongoose.model("depresp", RespDepSchema)

module.exports = RespDepModel