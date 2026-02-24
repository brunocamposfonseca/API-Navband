const PulseiraService = require("../services/pulseiraService");

class PulseiraController {
    async getPulseira(req, res) {
        const { uid } = req.params;
        try {
            const result = await PulseiraService.getPulseiraByUID(uid);
            if (!result) {
                return res.status(404).json({ message: "Pulseira não encontrada" });
            }

            return res.status(200).json({
                ...result
            });
        } catch (error) {
            return res.status(500).json({ message: "Erro ao buscar pulseira", error: error.message });
        }
    }

    
    async getAllPulseiraWithAcessoEDependente(req, res) {
        try {
            const result = await PulseiraService.getAllPulseiraWithAcessoEDependente();
            return res.status(200).json({
                pulseiras: result
            });
        } catch (error) {
            return res.status(500).json({ message: "Erro ao buscar pulseiras", error: error.message });
        }
    }   

    async createPulseira(req, res) {
        const { uid, tfcode } = req.body;
        try {
            const result = await PulseiraService.createPulseira(uid, tfcode);
            return res.status(201).json({
                ...result
            });
        } catch (error) {
            return res.status(500).json({ message: "Erro ao criar pulseira", error: error.message });
        }
    }

    async updatePulseira(req, res) {
        const { uid } = req.params;
        const { tfcode } = req.body;
        try {
            const result = await PulseiraService.updatePulseira(uid, tfcode);
            if (!result) {
                return res.status(404).json({ message: "Pulseira não encontrada" });
            }
            return res.status(200).json({
                ...result
            });
        }
        catch (error) {
            return res.status(500).json({ message: "Erro ao atualizar pulseira", error: error.message });
        }
    }

    async cleartfcode(req, res) {
        const { uid } = req.params;
        try {
            const result = await PulseiraService.cleartfcode(uid);
            if (!result) {
                return res.status(404).json({ message: "Pulseira não encontrada" });
            }
            return res.status(200).json({
                ...result
            });
        }   
        catch (error) {
            return res.status(500).json({ message: "Erro ao limpar tfcode", error: error.message });
        }   
    }
}


module.exports = new PulseiraController;
