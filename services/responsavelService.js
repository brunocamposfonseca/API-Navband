const Responsavel = require('../models/responsavelModel')
const User = require('../models/userModel')
const LoginService = require('./loginService')
const {v4: uuid} = require('uuid')
const bcrypt = require('bcrypt')

class ResponsavelService{
    async create({cpf, nome, sexo, dataNasc, email, telefone}){
        const senhaTemp = uuid()
        const id = uuid()
        const idLogin = uuid()

        try{
            const responsavel = await Responsavel.create({
                _id: id,
                email: email,
                cpf: cpf,
                telefone: telefone, 
                auth: idLogin
            })
            
            const usuario = await User.create([{ 
                _id: cpf,
                nome, 
                sexo, 
                dataNasc 
            }]);

            const login = await LoginService.createLogin(idLogin, senhaTemp)

            return {
                usuario: usuario[0],
                responsavel: responsavel,
                login: login[0]
            };
        }catch(error){
            throw error
        }
    }

    async resetPassword(cpf, newSenha){
        try{
            const responsavel = await Responsavel.findOne({cpf: cpf})
            if(!responsavel) return null

            const newSenha = await bcrypt.hash(newSenha, 10);
            const updatedLog = await LoginService.updateSenha(responsavel.auth, newSenha)

            if(!updatedLog) return null

            return newSenha
        }catch(error){
            throw error
        }
    }

    async findAll(){
        try{
            const responsaveis = await Responsavel.find().populate('cpf')

            return responsaveis
        }catch(error){
            throw error
        }
    }

    async findByCPF(cpf){
        try{
            const user = await User.findOne({_id: cpf})
            if(!user) return null

            const responsavel = await Responsavel
                .findOne({cpf: user._id})
                .populate('cpf')
                .lean()
            
            return responsavel
        }catch(error){
            throw error
        }
    }

    async findByEmail(email){
        try{
            const responsavel = await Responsavel
                .findOne({email})
                .populate('cpf')
                .lean()   
            
                return responsavel;
        }catch(error){
            throw error
        }
    }

    async update (cpf, data){
        try{
            const user = await User.findOne({_id: cpf})
            const resp = await Responsavel.findOne({cpf: cpf})

            if(!user || !resp) return null 

            const {
                nome = user.nome,
                sexo = user.sexo,
                dataNasc = user.dataNasc,
                email = resp.email,
                telefone = resp.telefone
            } = data

            await User.updateOne({_id: cpf}, {
                $set: {nome, sexo, dataNasc}
            })

            await Responsavel.updateOne({cpf: cpf},{
                $set: {telefone, email}
            })
            return true
        }catch(error){
            throw error
        }
    }

    async delete(cpf){
        try{
            const resp = await Responsavel.findOne({cpf: cpf})
            if(!resp) return {user: false, resp: false}

            const idLogin = resp.auth

            const deletedResp = await Responsavel.findByIdAndDelete(resp._id)
            const deletedUser = await User.findByIdAndDelete(cpf)
            const deletedLog = await LoginService.deleteLogin(idLogin)

            return{
                user: Boolean(deletedUser),
                resp: Boolean(deletedResp),
                login: Boolean(deletedLog)
            }
        }catch(error){
            throw error
        }
    }

    async updatePassword(cpf, newSenha){
        try{
            const resp = await Responsavel.findOne({_id: cpf})
            if(!resp) return null

            const updatedLog = await LoginService.updateSenha(resp.loginId, newSenha)

            return Boolean(updatedLog)
        }catch(error){
            throw error
        }
    }
}


module.exports = new ResponsavelService
