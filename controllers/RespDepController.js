const RespDepService = require("../services/RespDepService");

class RespDepController{
    async createRespDep(req, res){
        const { id_responsavel, id_dependente } = req.body;
        try{
            const newRespDep = await RespDepService.createRespDep(id_responsavel, id_dependente);

            if(!newRespDep){
                return res.status(400).json({ message: "Responsável-Dependente relationship could not be created." });
            }

            return res.status(201).json({
                message: "Responsável-Dependente relationship created successfully.",
                respDep: newRespDep
            });
        }catch(error){
            return res.status(500).json({ message: "Internal server error." });
        }
    }

    async getRespDepById(req, res){
        const { id } = req.params;
        try{
            const respDep = await RespDepService.getRespDepById(id);

            if(!respDep){
                return res.status(404).json({ message: "Responsável-Dependente relationship not found." });
            }

            return res.status(200).json({
                message: "Responsável-Dependente relationship retrieved successfully.",
                respDep: respDep
            });
        }catch(error){
            return res.status(500).json({ message: "Internal server error." });
        }
    }

    async getDepByIdResp(req, res){
        const { cpf } = req.params;
        try{
            const respDep = await RespDepService.getDepByIdResp(cpf);

            if(!respDep){
                return res.status(404).json({ message: "Dependentes not found for the given responsável." });
            }

            return res.status(200).json({
                message: "Dependentes retrieved successfully.",
                respDep: respDep
            });
        }catch(error){
            return res.status(500).json({ message: "Internal server error." });
        }
    }

    async getRespByIdDep(req, res){
        console.log("Acionou o getRespByIdDep");
        const { cpf } = req.params;
        try{
            const respDep = await RespDepService.getRespByIdDep(cpf);
            console.log("RespDep encontrado:", respDep);

            if(!respDep){
                return res.status(404).json({ message: "Responsável not found for the given dependente." });
            }


            return res.status(200).json({
                message: "Responsável retrieved successfully.",
                respDep: respDep
            });
        }catch(error){
            return res.status(500).json({ message: "Internal server error." });
        }
    }

    async deleteRespDepById(req, res){
        const { id } = req.params;
        try{
            const deletedRespDep = await RespDepService.deleteRespDep(id);

            if(!deletedRespDep){
                return res.status(404).json({ message: "Responsável-Dependente relationship not found." });
            }

            return res.status(200).json({
                message: "Responsável-Dependente relationship deleted successfully.",
                respDep: deletedRespDep
            });
        }catch(error){
            return res.status(500).json({ message: "Internal server error." });
        }
    }

    async updateRespDepById(req, res){
        const { id } = req.params;
        const { id_responsavel, id_dependente } = req.body;
        try{
            const updatedRespDep = await RespDepService.updateRespDep(id, { id_responsavel, id_dependente });

            if(!updatedRespDep){
                return res.status(404).json({ message: "Responsável-Dependente relationship not found." });
            }

            return res.status(200).json({
                message: "Responsável-Dependente relationship updated successfully.",
                respDep: updatedRespDep
            });
        }catch(error){
            return res.status(500).json({ message: "Internal server error." });
        }
    }

    async getAllDepsByIdResp(req, res){
        const { id_responsavel } = req.params;
        try{
            const respDeps = await RespDepService.getAllDepsByIdResp(id_responsavel);

            if(!respDeps){
                return res.status(404).json({ message: "No dependentes found for the given responsável." });
            }

            return res.status(200).json({
                message: "Dependentes retrieved successfully.",
                respDeps: respDeps
            });
        }catch(error){
            return res.status(500).json({ message: "Internal server error." });
        }
    }

    async getAllRespsByIdDep(req, res){
        const { id_dependente } = req.params;
        try{
            const respDeps = await RespDepService.getAllRespsByIdDep(id_dependente);

            if(!respDeps){
                return res.status(404).json({ message: "No responsáveis found for the given dependente." });
            }

            return res.status(200).json({
                message: "Responsáveis retrieved successfully.",
                respDeps: respDeps
            });
        }catch(error){
            return res.status(500).json({ message: "Internal server error." });
        }
    }   
}

module.exports = new RespDepController;