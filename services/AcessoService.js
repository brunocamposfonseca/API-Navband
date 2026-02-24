const LogService = require("./LogService");
const AcessoModel = require("../models/acessoModel");

class AcessoService{
    async getAcessoById(id){
        try {
            const response = await AcessoModel.findById(id);

            if(!response){
                return null;
            }

            return response;
        } catch (error) {
            throw error;
        }
    }

    async createAcesso({_id, coordenadas, id_depRes}){
        try {
            const response = await AcessoModel.create({
                _id,
                coordenadas,
                id_depRes
            })

            const log  = await LogService.createLog({ id_depRes });

            if(!response){
                return null;
            }

            return {response, log};
        } catch (error) {
            throw error;
        }
    }

    async updateCoordenadasAcesso(id, newCoordenadas){
        try {
            const response = await AcessoModel.findByIdAndUpdate(
                id,
                { coordenadas: newCoordenadas },
                { new: true }
            );

            if(!response){
                return null;
            }

            return response;
        } catch (error) {
            throw error;
        }
    }

    async verificaExisteAcesso(tfcode) {
        const acesso = await AcessoService.getAcessoById(tfcode);

        if (!acesso) {
            console.log(`❌ Acesso ${tfcode} não encontrado.`);
            return { error: "Acesso não encontrado." };
        }

        const depResp = await RespDepService.getRespDepById(acesso.id_depRes);


        const cpf = depResp.id_dependente;

        if (!depResp) {
            console.log(`❌ Relação Responsável-Dependente não encontrada para ID: ${acesso.id_depRes}`);
            return { error: "Relação Responsável-Dependente não encontrada." };
        }

        console.log("Relação Responsável-Dependente encontrada:", cpf);

        const dependente = await DependenteService.findByCPF({ cpf });

        if (!dependente) {
            console.log(`❌ Dependente com CPF ${depResp.id_dependente} não encontrado.`);
            return { error: "Dependente não encontrado." };
        }

        const nome = dependente?.Dependente?.cpf?.nome

        if (!nome) {
            console.log(`❌ Nome do dependente com CPF ${depResp.id_dependente} não encontrado.`);
            return { error: "Nome do dependente não encontrado." };
        }


        const _id = acesso._id;
        const coordenadas = acesso.coordenadas;
        const id_depRes = acesso.id_depRes;
        const acessoInfo = { _id, coordenadas, id_depRes, nome };

        console.log("Dependente associado ao acesso encontrado:", dependente);
        return acessoInfo
    }

    async deleteAcessoById(id){
        try {
            const response = await AcessoModel.findByIdAndDelete(id);

            if(!response){
                return null;
            }

            return response;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new AcessoService;