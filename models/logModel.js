const {default: mongoose} = require("mongoose")

const Schema = mongoose.Schema

const LogSchema = new Schema({
    _id: {type: String, required: true}, //uuid
    id_depRes: {type: String, ref: "dependenteResponsavel",required: false}
},{timestamps: true, versionKey: false})

const LogModel = mongoose.model("log", LogSchema)

module.exports = LogModel