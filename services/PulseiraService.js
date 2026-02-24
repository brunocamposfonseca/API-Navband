const PulseiraModel = require('../models/pulseiraModel');
const AcessoService = require('./acessoService');
const RespDepService = require('./respDepService');
const DependenteService = require('./dependenteService');

class PulseiraService {
    async getPulseiraByUID(uid) {
        try {
            const pulseira = await PulseiraModel.findOne({ _id: uid });

            if (!pulseira) {
                return null;
            }

            return pulseira;
        } catch (error) {
            throw error;
        }
    }

    
    async getAllPulseiraWithAcessoEDependente() {
        console.log("Entrou no service de pulseira");
        try {
            const pulseiras = await PulseiraModel.find({ tfcode: { $ne: "" } });
            console.log(pulseiras);

            const results = [];
            for (const pulseira of pulseiras) {
                console.log("Processando pulseira:", pulseira);
                const acesso = await AcessoService.getAcessoById(pulseira.tfcode);
                console.log("Acesso encontrado:", acesso);
                const respdep = await RespDepService.getRespDepById(acesso.id_depRes);
                console.log("RespDep encontrado:", respdep);
                let dependente = null;
                console.log("RespDep encontrado:", respdep);
                if (respdep) {
                    const cpf = respdep.id_dependente;
                    dependente = await DependenteService.findByCPF({cpf});
                    if (!dependente) {
                        return { error: "Dependente não encontrado" };
                    }
                }

                if (dependente) {
                    results.push({
                        pulseira,
                        acesso,
                        dependente
                    });
                }
            }
            console.log("Resultados finais:", results);
            return results;
        } catch (error) {
            throw error;
        }
    }

    async createPulseira(uid, tfcode) {
        try {
            const newPulseira = new PulseiraModel({
                _id: uid,
                tfcode: tfcode
            });

            const savedPulseira = await newPulseira.save();
            return savedPulseira;
        } catch (error) {
            throw error;
        }
    }

    async updatePulseira(uid, tfcode) {
        try {
            const updatedPulseira = await PulseiraModel.findOneAndUpdate(
                { _id: uid },
                { tfcode: tfcode }, 
                { new: true }
            );
            if (!updatedPulseira) {
                return null;
            }

            return updatedPulseira;
        } catch (error) {
            throw error;
        }
    }

    async cleartfcode(uid) {
        try {
            const clearedPulseira = await PulseiraModel.findOneAndUpdate(
                { _id: uid },
                { tfcode: null },
                { new: true }
            );
            if (!clearedPulseira) {
                return null;
            }
            return clearedPulseira;
        } catch (error) {
            throw error;
        }
    }
}


module.exports = new PulseiraService;
