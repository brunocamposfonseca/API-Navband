const {v4: uuid} = require('uuid');
const LogModel = require('../models/LogModel');

class LogService{
    async getAllLogs(){
        try {
            const logs = await LogModel.find();

            if(!logs || logs.length === 0){
                return null;
            }

            return logs;
        } catch (error) {
            throw error;
        }
    }

    async getLogById(id){
        try {
            const log = await LogModel.findById(id);

            if(!log){
                return null;
            }

            return log;
        } catch (error) {
            throw error;
        }
    }

    async createLog({ id_depRes }) {
        const id = uuid();
        try {
            const newLog = await LogModel.create({
                _id: id,
                id_depRes: id_depRes,
            });

            if(!newLog){
                return null;
            }

            return newLog;
        } catch (error) {
            throw error;
        }
    }

    async deletateLogById(id){
        try {
            const response = await LogModel.findByIdAndDelete(id);

            if(!response){
                return null;
            }

            return response;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new LogService;