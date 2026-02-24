const { default: mongoose } = require("mongoose");
const User = require('../models/userModel');
const DependenteService = require('../services/dependenteService');

class DependenteController {
    async create(req, res) {
        try {
            const result = await DependenteService.create(req.body)

            return res.status(201).json({
                message: "Dependente criado com sucesso!",
                ...result
            });
        } catch (error) {
            if (error.code === 11000) {
                return res.status(400).json({ message: "CPF já cadastrado." });
            }
            return res.status(500).json({ message: "Erro ao criar dependente", error: error.message });
        }
    }

    async findAll(req, res) {
        try{
            const result = await DependenteService.findAll()

            return res.status(200).json({
                ...result
            })
        }catch(error){
            return res.status(500).json({ message: "Erro ao tentar encontrar dependentes", error: error.message });
        }
    }

    async findOneCPF(req, res){
        try{
            const result = await DependenteService.findByCPF(req.params)
    
            if(!result){
                //retorna erro caso nem exista usuário
                return  res.status(404).json({ message: "Dependente não encontrado" });
            }

            return res.status(200).json({
                ...result
            });

        }catch(error){
            res.status(500).json({ message: 'não foi possível achar o usuário', error: error.message })
        }
    }

    async updateUser (req,res){
        const {cpf} = req.body
        
        try{
            const success = await DependenteService.update(cpf, req.body)

            if(!success){
                return res.status(404).json({ message: 'Usuário ou Dependente não encontrado' });
            }

            return res.status(200).json("Usuário atualizado com sucesso")
        }catch(error){
            res.status(500).json({ message: 'Erro ao atualizar usuário', error: error.message });
        }
    }

    async deleteUser (req, res){
        const {cpf} = req.body

        try{
            const result = await DependenteService.delete(cpf)

            if(!result.user){
                return res.status(404).json({ message: 'Não foi possível encontrar o usuário para deletá-lo' });
            }
            //Um usuário pode ser funcionário e cliente, por isso 2 ifs
            if(!result.child){
                return res.status(404).json({message: "Não foi possível encontrar o dependente para deletá-lo"})
            }
            return res.status(200).json("Usuário deletado com sucesso");
        }catch(error){
            res.status(500).json({ message: 'Erro ao deletar usuário', error: error.message });
        }
    }
}


module.exports = new DependenteController
