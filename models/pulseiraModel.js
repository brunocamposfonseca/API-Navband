const { default: mongoose } = require("mongoose")

const Schema = mongoose.Schema

const pulseiraSchema = new Schema({
    _id: { type: String, required: true},//uuid
    tfcode: { type: String, ref: "acesso",required: false}
}, { versionKey: false })

const PulseiraModel = mongoose.model("pulseira", pulseiraSchema)

module.exports = PulseiraModel