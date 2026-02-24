const { Router } = require('express')
const FuncionarioController = require('./controllers/funcionarioController');
const ResponsavelController = require('./controllers/responsavelController');
const DependenteController = require('./controllers/dependenteController');
const LoginController = require('./controllers/loginController');
const PulseiraController = require('./controllers/pulseiraController');
const AcessoController = require('./controllers/acessoController');
const LogController = require('./controllers/logController');
const RespDepController = require('./controllers/respDepController');

const cors = require('cors')

const routes = Router()

routes.use(cors())

const funcionario = FuncionarioController;
const responsavel = ResponsavelController;
const dependente = DependenteController;
const login = LoginController;
const acesso = AcessoController;
const log = LogController;
const respdep = RespDepController;
const pulseira = PulseiraController;

routes.get('/', (req, res) => {
    res.sendFile(__dirname + "/app/index.html");
    //res.json({message: "Bem-vindo à API"})
});

routes.get('/api/', (req, res) => {
    res.sendFile(__dirname + "/app/index.html");
    //res.json({message: "Bem-vindo ao HTTP"})
});

//relacionado aos funcionários
routes.post('/api/funcionario', funcionario.create)
routes.get('/api/funcionarios', funcionario.findAll);
routes.get('/api/funcionario/loginC/:cpf', funcionario.findOneCPF)
routes.get('/api/funcionario/loginE/:email', funcionario.findOneEmail)
routes.put('/api/funcionario/update', funcionario.updateUser)
routes.delete('/api/funcionario/delete', funcionario.deleteUser)

//relacionado aos responsáveis
routes.post('/api/responsavel', responsavel.create)
routes.get('/api/responsaveis', responsavel.findAll)
routes.get('/api/responsavel/loginC/:cpf', responsavel.findOneCPF)
routes.get('/api/responsavel/loginE/:email', responsavel.findOneEmail)
routes.put('/api/responsavel/update', responsavel.updateUser)
routes.delete('/api/responsavel/delete', responsavel.deleteUser)

//rotas pulseira
routes.get('/api/pulseiras/:uid', PulseiraController.getPulseira)
routes.put('/api/pulseiras/:uid', PulseiraController.updatePulseira)
routes.delete('/api/pulseiras/clear/:uid', PulseiraController.cleartfcode)
routes.post('/api/pulseira', PulseiraController.createPulseira)

//relacionado às crianças
routes.post('/api/dependente', dependente.create)
routes.get('/api/dependentes', dependente.findAll)
routes.get('/api/dependente/:cpf', dependente.findOneCPF)
routes.put('/api/dependente/update', dependente.updateUser)
routes.delete('/api/dependente/delete', dependente.deleteUser)

//acessos
routes.get('/api/acessos/:uid', acesso.getAcessoById)
routes.post('/api/acessos', acesso.createAcesso)
routes.put('/api/acessos/:uid', acesso.updateCoordenadasAcesso)
routes.delete('/api/acessos/:uid', acesso.deleteAcessoById)

//log
routes.get('/api/logs', log.getAllLogs)
routes.get('/api/logs/:uid', log.getLogById)
routes.post('/api/logs', log.createLog)
routes.delete('/api/logs/:uid', log.deletateLogById)

//Responsável Dependente

routes.post('/api/respdep', respdep.createRespDep)
routes.get('/api/respdep/:uid', respdep.getRespDepById)
routes.get('/api/respdep/responsavel/:cpf', respdep.getDepByIdResp)
routes.get('/api/respdep/dependente/:cpf', respdep.getRespByIdDep)
routes.get('/api/respdeps/responsavel/:uid', respdep.getAllDepsByIdResp)
routes.get('/api/respdeps/dependente/:uid', respdep.getAllRespsByIdDep)
routes.delete('/api/respdep/:uid', respdep.deleteRespDepById)
routes.put('/api/respdep/:uid', respdep.updateRespDepById)

// Login

routes.post('/api/login', login.login);
routes.post('/api/resetPass', login.resetPassword);


routes.get('/api/pulseiras-dependente/', pulseira.getAllPulseiraWithAcessoEDependente);
routes.post('/api/acessos/existe/:tfcode', acesso.verificaExisteAcesso);

//troca de senha
// routes.put('/api/resetPass')

//realizar login
// routes.get('/api/login')


module.exports = routes;
