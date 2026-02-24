const User = require('../models/userModel')
const Login = require('../models/loginModel')
const Funcionario = require('../models/funcionarioModel')
const Responsavel = require('../models/responsavelModel')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')

class LoginService {
    async login(cpf = null, email = null, senha, job = "funcionario") {
        const SECRET_KEY = process.env.JWT_SECRET;
        const senhaDigitada = senha;

        let userObj = null;

        console.log('Login attempt with CPF:', cpf, 'Email:', email);

        try {
            if (job === "funcionario") {
                console.log('Buscando funcionário...');
                if (cpf) {
                    userObj = await Funcionario.findOne({ cpf: cpf });
                } else if (email) {
                    userObj = await Funcionario.findOne({ email: email });
                }
            } else if (job === "responsavel") {
                console.log('Buscando responsável...');
                if (cpf) {
                    userObj = await Responsavel.findOne({ cpf: cpf });
                } else if (email) {
                    userObj = await Responsavel.findOne({ email: email });
                }
            }

            console.log('userObj:', userObj);

            if (!userObj || userObj == null) {
                // Não encontrou usuário com CPF ou Email
                return { error: 'Usuário não encontrado' };
            }

            const loginId = userObj.auth;
            console.log('Associated login ID:', loginId);
            const loginData = await Login.findOne({ _id: loginId });

            console.log('loginData:', loginData);

            if (!loginData || !loginData.senha) {
                // Login associado não encontrado ou sem senha
                console.error('Login record not found or missing password hash.');
                return { error: 'Erro no registro de login' };
            }

            // === PONTO CHAVE: Usando await com bcrypt.compare (encapsulado ou usando versão Promise) ===
            // Se a sua biblioteca bcrypt não suportar nativamente await/Promise, você precisa
            // envolvê-la em uma Promise. A maioria das libs modernas suporta:
            const isMatch = await bcrypt.compare(senhaDigitada, loginData.senha);

            console.log('Password match:', isMatch);

            if (!isMatch) {
                return { error: 'Senha incorreta' };
            }

            // === Se as senhas baterem, o código continua aqui ===

            // Buscando detalhes adicionais (assumindo que User busca pelo CPF/ID do usuário principal)
            const userDetails = await User.findOne({ _id: userObj.cpf });

            console.log('userDetails:', userDetails);

            const payload = {
                cpf: userObj.cpf,
                username: userDetails?.nome || '', // Usando Optional Chaining para segurança
                email: userObj.email || '',
                // Assumindo que 'cargo' é o campo de role. Se for um Responsavel, pode ser 'Responsavel'
                role: userObj.cargo || userObj.constructor.modelName || 'user'
            };

            const expireIn = '30d';

            // Melhor manter gerarToken fora da função, mas mantendo a estrutura original
            function gerarToken(payload, secret, options) {
                try {
                    // Assumindo que 'jwt' está importado
                    const token = jwt.sign(payload, secret, options);
                    return token;
                } catch (error) {
                    console.error('Error generating token:', error);
                    return null;
                }
            }

            const token = gerarToken(payload, SECRET_KEY, { expiresIn: expireIn });

            if (!token) {
                return { error: 'Falha ao gerar o token de autenticação' };
            }

            console.log('Generated Token:', token);

            return { token: token };

        } catch (error) {
            console.error('Login function failed:', error);
            throw error;
        }
    }

    async createLogin(uuid, senha) {
        const senhaHash = await bcrypt.hash(senha, 10);

        try {
            const login = Login.create({ _id: uuid, senha: senhaHash })
            return login
        } catch (error) {
            throw error
        }
    }

    async deleteLogin(uuid) {
        try {
            const login = await Login.findOne({ _id: uuid })
            if (!login) return { login: false };

            const deletedLog = await Login.findByIdAndDelete(uuid)

            return deletedLog
        } catch (error) {
            throw error;
        }
    }

    async updateSenha(uuid, novaSenha) {
        try {
            const senhaHash = await bcrypt.hash(novaSenha, 10);

            const login = await Login.findOne({ _id: uuid });

            if (!login) {
                console.log(`Login record not found for UUID: ${uuid}`);
                return false;
            }

            const result = await Login.updateOne({ _id: uuid }, {
                $set: { senha: senhaHash }
            });

            if (result.modifiedCount > 0) {
                console.log(`Password updated successfully for UUID: ${uuid}`);
                return { message: 'Senha atualizada com sucesso!' };
            } else {
                console.log(`Password update attempted but no changes made for UUID: ${uuid}`);
                return { error: 'Nenhuma alteração feita. Você não pode inserir a mesma senha' };
            }

        } catch (error) {
            console.error('Error during password update:', error);
            throw error;
        }
    }
}

module.exports = new LoginService