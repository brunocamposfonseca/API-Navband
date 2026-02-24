const {default: mongoose} = require("mongoose");
const ResponsavelService = require("../services/responsavelService")

class ResponsavelController {
    async create(req,res){
        try{
            const result = await ResponsavelService.create(req.body)
            
            res.status(201).json({
              message: 'Responsável criado com sucesso!',
              ...result
            });
        }catch(error){
            if (error.code === 11000) {
                return res.status(400).json({ message: 'CPF já cadastrado.' });
            }
        
            res.status(500).json({ message: 'Erro ao criar usuário', error: error.message });
        }
    }

    async resetPassword(req,res){
        const {cpf, newSenha} = req.body
        try{
            const newSenha = await ResponsavelService.resetPassword(cpf, newSenha)
            if(!newSenha){
                return res.status(404).json({ message: 'Responsável não encontrado para resetar a senha' });
            }

            return res.status(200).json({ message: 'Senha resetada com sucesso', novaSenha: newSenha });
        }catch(error){
            return res.status(500).json({ message: 'Erro ao resetar senha', error: error.message });
        }
    }

    async findAll(req, res){
        try{
            const result = await ResponsavelService.findAll()

            if (!result || result.length === 0) {
                return res.status(404).json({ message: "Responsáveis não encontrados" });
            }

            return res.status(200).json({
                ...result
            })
        }catch(error){
            return res.status(500).json({ message: 'Erro ao buscar responsáveis', error: error.message })
        }
    }
    async findOneCPF(req,res){
        const { cpf } = req.params
        
        try{
            const result = await ResponsavelService.findByCPF(cpf)
            if(!result){
                //retorna erro caso nem exista usuário
                return  res.status(404).json({ message: "responsável não encontrado" });
            }
    
            return res.status(200).json({
                ...result
            });

        }catch(error){
            res.status(500).json({ message: 'erro ao buscar responsável', error: error.message })
        }
    }
    async findOneEmail(req,res){
        const {email} = req.params
        
        try{
            const result = await ResponsavelService.findByEmail(email)
           
            if (!result) {
                return res.status(404).json({ message: "Responsável não encontrado" });
            }
    
            return res.status(200).json({
                ...result
            });
        }catch(error){
            res.status(500).json({ message: 'erro ao buscar responsável', error: error.message })
        }
    }

    async updateUser (req,res){
        const {cpf} = req.body
        
        try{
            const success = await ResponsavelService.update(cpf, req.body)

            if(!success){
                return res.status(404).json({ message: 'Usuário ou Responsável não encontrado' });
            }

            return res.status(200).json("Usuário atualizado com sucesso")

        }catch(error){
            return res.status(500).json({ message: 'Erro ao atualizar usuário', error: error.message });
        }
    }

    async deleteUser (req, res){
        const {cpf} = req.body

        try{
            const result = await ResponsavelService.delete(cpf)

            if(!result.user){
                return res.status(404).json({ message: 'Usuário não encontrado para deletar' });
            }
            //Um usuário pode ser funcionário e cliente, por isso 2 ifs
            if(!result.resp){
                return res.status(404).json({message: "Funcionário não encontrado para deletar"})
            }
            return res.status(200).json("Usuário deletado com sucesso");
        }catch(error){
            res.status(500).json({ message: 'Erro ao deletar usuário', error: error.message });
        }
    }
}


module.exports = new ResponsavelController
