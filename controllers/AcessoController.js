const AcessoService = require("../services/AcessoService");

class AcessoController{
    async getAcessoById(req, res){
        try {
            const acesso = await AcessoService.getAcessoById(req.params.uid);

            if(!acesso){
                return res.status(404).json({message: "Acesso não encontrado."});
            }

            return res.status(200).json({
                message: "Acesso encontrado com sucesso!",
                ...acesso
            });
        } catch (error) {
            return res.status(500).json({message: "Erro interno do servidor.", error: error.message});
        }
    }

    async createAcesso(req, res){
        try {
            const newAcesso = await AcessoService.createAcesso(req.body);

            if(!newAcesso){
                return res.status(400).json({message: "Erro ao criar acesso."});
            }

            return res.status(201).json({
                message: "Acesso criado com sucesso!",
                ...newAcesso
            });
        } catch (error) {
            return res.status(500).json({message: "Erro interno do servidor.", error: error.message});
        }
    }

    async verificaExisteAcesso(req, res){
        try {
            const acesso = await AcessoService.verificaExisteAcesso(req.params.tfcode);
            if(!acesso){
                return res.status(404).json({message: "Acesso não encontrado."});
            }
            return res.status(200).json({
                message: "Acesso encontrado com sucesso!",
                ...acesso
            });
        } catch (error) {
            return res.status(500).json({message: "Erro interno do servidor.", error: error.message});
        }
    }

    async updateCoordenadasAcesso(req, res){
        try {
            const acessoId = req.params.uid;
            const newCoordenadas = req.body.coordenadas;

            const updatedAcesso = await AcessoService.updateCoordenadasAcesso(acessoId, newCoordenadas);

            if(!updatedAcesso){
                return res.status(404).json({message: "Acesso não encontrado."});
            }

            return res.status(200).json({
                message: "Coordenadas do acesso atualizadas com sucesso!",
                ...updatedAcesso
            });
        } catch (error) {
            return res.status(500).json({message: "Erro interno do servidor.", error: error.message});
        }
    }

    async deleteAcessoById(req, res){
        try {
            const deletedAcesso = await AcessoService.deleteAcessoById(req.params.uid);

            if(!deletedAcesso){
                return res.status(404).json({message: "Acesso não encontrado."});
            }

            return res.status(200).json({
                message: "Acesso deletado com sucesso!",
                ...deletedAcesso
            });
        } catch (error) {
            return res.status(500).json({message: "Erro interno do servidor.", error: error.message});
        }
    }
}

module.exports = new AcessoController;