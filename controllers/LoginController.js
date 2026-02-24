const { default: mongoose } = require("mongoose")
const LoginService = require('../services/LoginService')



class LoginController {
  async login(req, res) {
    try {
      const { cpf, email, senha } = req.body;
      const result = await LoginService.login(cpf, email, senha);
      
      if (!result) {
        return res.status(401).json({ message: "Credenciais inválidas" });
      }
      return res.status(200).json({
        message: "Login realizado com sucesso",
        ...result
      });
    } catch (error) {
      return res.status(500).json({ message: "Erro ao realizar login", error: error.message });
    }
  }

  async resetPassword(req, res) {
    try {
      const { _id, novaSenha } = req.body;
      const result = await LoginService.updateSenha(_id, novaSenha);
      
      if (!result) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }
      return res.status(200).json({
        message: "Senha atualizada com sucesso",
        ...result
      });
    } catch (error) {
      return res.status(500).json({ message: "Erro ao atualizar senha", error: error.message });
    }
  }
}

module.exports = new LoginController