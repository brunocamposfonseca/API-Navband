const Funcionario = require('../models/funcionarioModel');
const User = require('../models/userModel')
const LoginService = require('./loginService')
const {v4: uuid} = require('uuid')
const bcrypt = require('bcrypt')

class FuncionarioService{
    async create({ cpf, nome, sexo, dataNasc, email, senha, telefone, cargo }) {
        const idLogin = uuid();
        const idFuncionario = uuid()

        try {
            const funcionario = await Funcionario.create([{
                _id: idFuncionario,
                email,
                telefone,
                cargo,
                cpf,
                auth: idLogin,
            }]);
            
            const usuario = await User.create([{
                _id: cpf,
                nome,
                sexo,
                dataNasc
            }]);
            
            const login = await LoginService.createLogin(idLogin, senha)

            return {
                usuario: usuario[0],
                login: login[0],
                funcionario: funcionario
            };
        } catch (error) {
            throw error;
        }
    }

    async findAll() {
        try {
            const funcionarios = await Funcionario.find().populate("cpf");
            return funcionarios;
        } catch (error) {
            throw error;
        }
    }

    async findByCPF(cpf) {
        try {
            const user = await User.findOne({ _id: cpf })
            if (!user) return null;

            const funcionario = await Funcionario
                .findOne({ cpf: cpf })
                .populate("cpf")
                .lean()

            return funcionario;
        } catch (error) {
            throw error;
        }
    }

    async findByEmail(email) {
        try {
            const funcionario = await Funcionario
                .findOne({email})
                .populate("cpf")
                .lean()

            return funcionario;
        } catch (error) {
            throw error;
        }
    }

    async update(cpf, data) {
        try {
            const user = await User.findOne({ _id: cpf });
            const func = await Funcionario.findOne({ cpf: cpf });

            if (!user || !func) return null;

            const {
                nome = user.nome,
                sexo = user.sexo,
                dataNasc = user.dataNasc,
                telefone = func.telefone,
                cargo = func.cargo,
                email = func.email
            } = data;

            await User.updateOne({ _id: cpf }, {
                $set: { nome, sexo, dataNasc }
            });

            await Funcionario.updateOne({ cpf: cpf }, {
                $set: { telefone, cargo, email }
            });

            return true;
        } catch (error) {
            throw error;
        }
    }

    async delete(cpf) {
        try {
            const func = await Funcionario.findOne({ cpf: cpf });
            if (!func) return { user: false, func: false };
            
            const idLogin = func.auth

            const deletedFunc = await Funcionario.findByIdAndDelete(func._id);
            const deletedUser = await User.findByIdAndDelete({ _id: func.cpf });
            const deletedLog = await LoginService.deleteLogin(idLogin)

            return {
                user: Boolean(deletedUser),
                func: Boolean(deletedFunc),
                login: Boolean(deletedLog)
            };
        } catch (error) {
            throw error;
        }
    }

    async updatePassword(cpf, newSenha) {
        try {
            const func = await Funcionario.findOne({ cpf: cpf });
            if (!func) return null;

            const novaSenha = await bcrypt.hash(newSenha, 10)
            const updatedLogin = await LoginService.updateSenha(func.auth, novaSenha)

            return updatedLogin;
        } catch (error) {
            throw error;
        }
    }
}


module.exports = new FuncionarioService;
