const { default: mongoose } = require("mongoose");
const FuncionarioService = require('../services/FuncionarioService');

class FuncionarioController {
    async create(req, res) {
        try {
            const result = await FuncionarioService.create(req.body);

            return res.status(201).json({
                message: "Funcionário criado com sucesso!",
                ...result
            });

        } catch (error) {
            if (error.code === 11000) {
                return res.status(400).json({ message: "CPF já cadastrado." });
            }
            return res.status(500).json({ message: "Erro ao criar funcionário", error: error.message });
        }
    }

    async resetPassword(req, res) {
        try {
            const result = await FuncionarioService.resetPassword(req.body);
            if (!result) {
                return res.status(404).json({ message: "Funcionário não encontrado" });
            }
            return res.status(200).json({
                ...result
            });
        } catch (error) {
            return res.status(500).json({ message: "Erro ao resetar a senha do funcionário", error: error.message });
        }
    }

    async findAll(req, res) {
        try {
            const result = await FuncionarioService.findAll();

            if (!result || result.length === 0) {
                return res.status(404).json({ message: "Funcionários não encontrados" });
            }

            return res.status(200).json({
                ...result
            });

        } catch (error) {
            return res.status(500).json({ message: "Erro ao buscar funcionários", error: error.message });
        }
    }

    async findOneCPF(req, res) {
        const { cpf } = req.params;

        try {
            const result = await FuncionarioService.findByCPF(cpf);

            if (!result) {
                return res.status(404).json({ message: "Funcionário não encontrado" });
            }

            return res.status(200).json({
                ...result
            });

        } catch (error) {
            return res.status(500).json({ message: "Erro ao buscar funcionário", error: error.message });
        }
    }

    async findOneEmail(req, res) {
        const { email } = req.params;

        try {
            const result = await FuncionarioService.findByEmail(email);

            if (!result) {
                return res.status(404).json({ message: "Funcionário não encontrado" });
            }

            return res.status(200).json({
                ...result
            });

        } catch (error) {
            return res.status(500).json({ message: "Erro ao buscar funcionário", error: error.message });
        }
    }

    async updateUser(req, res) {
        const { cpf } = req.body;

        try {
            const success = await FuncionarioService.update(cpf, req.body);

            if (!success) {
                return res.status(404).json({ message: "Usuário ou funcionário não encontrado" });
            }

            return res.status(200).json("Usuário atualizado com sucesso");

        } catch (error) {
            return res.status(500).json({ message: "Erro ao atualizar usuário", error: error.message });
        }
    }

    async deleteUser(req, res) {
        const { cpf } = req.body;

        try {
            const result = await FuncionarioService.delete(cpf);

            if (!result.user) {
                return res.status(404).json({ message: "Usuário não encontrado para deletar" });
            }
            if (!result.func) {
                return res.status(404).json({ message: "Funcionário não encontrado para deletar" });
            }

            return res.status(200).json("Usuário deletado com sucesso", result);

        } catch (error) {
            return res.status(500).json({ message: "Erro ao deletar usuário", error: error.message });
        }
    }
}

module.exports = new FuncionarioController;