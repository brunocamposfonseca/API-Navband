const LogService = require("../services/LogService");

class LogController{
    async getAllLogs(req, res){
        try {
            const logs = await LogService.getAllLogs();

            if(!logs){
                return res.status(404).json({ message: "No logs found." });
            }

            return res.status(200).json({
                message: "Logs retrieved successfully.",
                logs: logs
            });
        } catch (error) {
            return res.status(500).json({ message: "Internal server error." });
        }
    }

    async getLogById(req, res){
        const { uid } = req.params;

        try {
            const log = await LogService.getLogById(uid);

            if(!log){
                return res.status(404).json({ message: "Log not found." });
            }

            return res.status(200).json({
                message: "Log retrieved successfully.",
                log: log
            });
        } catch (error) {
            return res.status(500).json({ message: "Internal server error." });
        }
    }

    async createLog(req, res){
        const { id_depRes } = req.body;
        try {
            const newLog = await LogService.createLog({ id_depRes });

            if(!newLog){
                return res.status(400).json({ message: "Log could not be created." });
            }

            return res.status(201).json({
                message: "Log created successfully.",
                log: newLog
            });
        } catch (error) {
            return res.status(500).json({ message: "Internal server error." });
        }
    }

    async deletateLogById(req, res){
        const { uid } = req.params;
        try {
            const deletedLog = await LogService.deletateLogById(uid);

            if(!deletedLog){
                return res.status(404).json({ message: "Log not found." });
            }

            return res.status(200).json({
                message: "Log deleted successfully.",
                log: deletedLog
            });
        } catch (error) {
            return res.status(500).json({ message: "Internal server error." });
        }
    }
}

module.exports = new LogController;