// ControllerAPI.js (CORRIGIDO)

const PulseiraService = require('../services/pulseiraService');
const ResponsavelService = require('../services/responsavelService');
const AcessoService = require('../services/acessoService');
const LoginService = require('../services/loginService');
const RespDepService = require('../services/respDepService');
const DependenteService = require('../services/dependenteService');

class ControllerAPI {
    constructor(dataObject) { 
        if (!dataObject) {
            console.error("❌ Objeto de dados não recebido.");
            console.log("✔ Inicializando com data = null");
            this.data = null;
        } else {
            this.data = dataObject;
            console.log("✔ Objeto de dados recebido:", this.data); 
        }
    }

    async getPulseira() {
        if (!this.data?.uid) {
            console.log("❌ UID da pulseira não fornecido.");
            return null;
        }

        const pulseira = await PulseiraService.getPulseiraByUID(this.data.uid);

        if (!pulseira) {
            console.log(`❌ Pulseira com UID ${this.data.uid} não encontrada.`); 
            return {error: "Pulseira não encontrada."};
        }

        console.log(`✔ Pulseira encontrada: ${JSON.stringify(pulseira)}`);
        return pulseira;
    }

    async updateAcesso() {
        if (!this.data?.tfcode || !this.data?.coordenadas) {
            console.log("❌ Dados insuficientes para atualizar acesso.");
            return {error: "Dados insuficientes para atualizar acesso."};
        }

        const updated = await AcessoService.updateCoordenadasAcesso(
            this.data.tfcode,
            this.data.coordenadas
        );

        if (!updated) {
            console.log(`❌ Falha ao atualizar acesso: ${this.data.tfcode}`);
            return {error: "Falha ao atualizar acesso."};
        }

        console.log(`✔ Acesso atualizado: Lat = ${updated.coordenadas.coordinates[0]}, Lng = ${updated.coordenadas.coordinates[1]}`);
        return updated;
    }

    async verificaExisteAcesso() {
        if (!this.data?.tfcode) {
            console.log("❌ ID do acesso não fornecido.");
            return {error: "ID do acesso não fornecido."};
        }

        console.log(`Buscando acesso com ID: ${this.data.tfcode}`);

        const acesso = await AcessoService.getAcessoById(this.data.tfcode);

        if (!acesso) {
            console.log(`❌ Acesso ${this.data.tfcode} não encontrado.`);
            return {error: "Acesso não encontrado."};
        }

        // Coleta as informações do dependente pelo id_depRes retornado no acesso
        const depResp = await RespDepService.getRespDepById(acesso.id_depRes);


        const cpf = depResp.id_dependente;

        if (!depResp) {
            console.log(`❌ Relação Responsável-Dependente não encontrada para ID: ${acesso.id_depRes}`);
            return {error: "Relação Responsável-Dependente não encontrada."};
        }

        console.log("Relação Responsável-Dependente encontrada:", cpf);

        const dependente = await DependenteService.findByCPF({cpf});

        if (!dependente) {
            console.log(`❌ Dependente com CPF ${depResp.id_dependente} não encontrado.`);
            return {error: "Dependente não encontrado."};
        }

        const nome = dependente?.Dependente?.cpf?.nome

        if (!nome) {
            console.log(`❌ Nome do dependente com CPF ${depResp.id_dependente} não encontrado.`);
            return {error: "Nome do dependente não encontrado."};
        }


        const _id = acesso._id;
        const coordenadas = acesso.coordenadas;
        const id_depRes = acesso.id_depRes;
        const acessoInfo = { _id, coordenadas, id_depRes, nome };

        console.log("Dependente associado ao acesso encontrado:", dependente);
        return acessoInfo
    }

    async getAcesso() {
        if (!this.data?.tfcode) {
            console.log("❌ ID do acesso não fornecido.");
            return {error: "ID do acesso não fornecido."};
        }

        console.log(`Buscando acesso com ID: ${this.data.tfcode}`);

        const acesso = await AcessoService.getAcessoById(this.data.tfcode);

        if (!acesso) {
            console.log(`❌ Acesso ${this.data.tfcode} não encontrado.`);
            return {error: "Acesso não encontrado."};
        }

        return acesso
    }

    async loginUser() { 
        if (!this.data) {
            console.log("❌ Dados não recebidos.");
            return null;
        }

        const { cpf, email, senha } = this.data;

        console.log("Dados de login recebidos:", this.data);


        if ((!cpf && !email) || !senha) {
            console.log("❌ CPF/email ou senha não fornecidos.");
            return null;
        }

        console.log("Iniciando processo de login para:", cpf || email);
        const login = await LoginService.login(cpf, email, senha, "responsavel");

        if (!login) {
            console.log(`❌ Falha no login: ${cpf || email}`);
            return null;
        }

        console.log(`✔ Login bem-sucedido: ${cpf || email}`);
        return login;
    }

    async updatePasswordResponsavel() {
        if (!this.data) {
            console.log("❌ Dados não recebidos.");
            return null;
        }

        const { cpf, novaSenha } = this.data;

        if (!cpf || !novaSenha) {
            console.log("❌ CPF ou novaSenha não fornecidos.");
            return null;
        }

        const update = await ResponsavelService.updatePassword(cpf, novaSenha);

        if (!update) {
            console.log(`❌ Falha ao atualizar senha para CPF: ${cpf}`);
            return null;
        }

        console.log(`✔ Senha atualizada para CPF: ${cpf}`);
        return update;
    }

    async getDependenteByIdDepResp(){
        if (!this.data?.id_depRes) {
            console.log("❌ ID do dependente/responsável não fornecido.");
            return null;
        }

        const dependente = await ResponsavelService.getDependenteByIdDepResp(this.data.id_depRes);

        if (!dependente) {
            console.log(`❌ Dependente/Responsável com ID ${this.data.id_depRes} não encontrado.`);
            return null;
        }
    }
}


module.exports = ControllerAPI;
