const Dependente = require('../models/dependenteModel');
const User = require('../models/userModel')
const {v4: uuid} = require('uuid')

class DependenteService {
    async create({ cpf, nome, sexo, dataNasc, autorizacao }) {
        try {
            const dependente = await Dependente.create([{
                _id: uuid(),
                autorizacao: autorizacao,
                cpf: cpf
            }])

            const usuario = await User.create([{ _id: cpf, nome, sexo, dataNasc }]);

            return {
                usuario: usuario[0],
                dependente: dependente
            };

        } catch (error) {
            throw error
        }

    }

    async findAll() {
        try {
            const findDependente = await Dependente.find().populate('cpf')
            if (!findDependente) {
                return { message: "Dependentes não encontrados" };
            }

            return findDependente

        } catch (error) {
            throw error
        }
    }

    async findByCPF({ cpf }) {
        try {
            const findUser = await User.findOne({ _id: cpf })

            const findDependente = await Dependente.findOne({ cpf: findUser._id }).populate('cpf').lean()

            return {
                Dependente: findDependente
            };

        } catch (error) {
            throw error
        }
    }

    async update(cpf, data) {
        try {
            const user = await User.findOne({ _id: cpf })
            const child = await Dependente.findOne({ cpf: cpf })

            if (!user || !child) return null

            const {
                nome = user.nome,
                sexo = user.sexo,
                dataNasc = user.dataNasc,
                autorizacao = child.autorizacao
            } = data

            await User.updateOne({ _id: cpf }, {
                $set: { nome, sexo, dataNasc }
            })

            await Dependente.updateOne({ cpf: cpf }, {
                $set: { autorizacao }
            })
            return true
        } catch (error) {
            throw error
        }
    }

    async delete(cpf) {
        try {
            const child = await Dependente.findOne({ cpf: cpf })
            if (!child) return { user: false, child: false }

            const deletedChild = await Dependente.findByIdAndDelete(child._id)
            const deletedUser = await User.findByIdAndDelete({ _id: cpf })

            return {
                user: Boolean(deletedUser),
                child: Boolean(deletedChild)
            }
        } catch (error) {
            throw error
        }
    }
}

module.exports = new DependenteService;