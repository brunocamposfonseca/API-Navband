const RespDepModel = require("../models/RespDepModel");
const {v4: uuid} = require('uuid')

class RespDepService{
    async createRespDep( id_responsavel, id_dependente ){
        try{
            const existingRespDep = await RespDepModel.findOne({ id_responsavel, id_dependente });
            if(existingRespDep){
                return existingRespDep;
            } else{
                const newRespDep = await RespDepModel.create({
                    _id: uuid(),
                    id_responsavel,
                    id_dependente
                });

                if(!newRespDep){
                    return null;
                }

                return newRespDep;
            }

        }catch(error){
            throw error;
        }
    }

    async getRespDepById(id){
        try{
            const respDep = await RespDepModel.findById(id);

            if(!respDep){
                return null;
            }

            return respDep;
        }catch(error){
            throw error;
        }
    }

    async getDepByIdResp(cpf){
        try{
            const respDep = await RespDepModel.find({ id_responsavel: cpf });

            if(!respDep){
                return null;
            }

            return respDep;
        }catch(error){
            throw error;
        }
    }

    async getRespByIdDep(cpf){
        try{
            const respDep = await RespDepModel.findOne({ id_dependente: cpf });

            if(!respDep){
                return null;
            }

            return respDep;
        }catch(error){
            throw error;
        }
    }

    async updateRespDep(id, { id_responsavel, id_dependente }){
        try{
            const respDep = await RespDepModel.findByIdAndUpdate(
                id,
                { id_responsavel, id_dependente },
                { new: true }
            );

            if(!respDep){
                return null;
            }

            return respDep;
        }catch(error){
            throw error;
        }
    }

    async deleteRespDep(id){
        try{
            const respDep = await RespDepModel.findByIdAndDelete(id);

            if(!respDep){
                return null;
            }

            return respDep;
        }catch(error){
            throw error;
        }
    }

    async getAllDepsByIdResp(id_responsavel){
        try{
            const respDeps = await RespDepModel.find({ id_responsavel: id_responsavel });

            if(!respDeps){
                return null;
            }

            return respDeps;
        }catch(error){
            throw error;
        }
    }

    async getAllRespsByIdDep(id_dependente){
        try{
            const respDeps = await RespDepModel.find({ id_dependente: id_dependente });

            if(!respDeps){
                return null;
            }

            return respDeps;
        }catch(error){
            throw error;
        }
    }
}

module.exports = new RespDepService;