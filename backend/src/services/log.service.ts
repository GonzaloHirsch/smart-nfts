import bunyan from 'bunyan';
import path from 'path';

class Logger {
    private static instance: Logger;
    public logger: bunyan;
    private logUrlInfo = path.resolve(__dirname,'../logs/backend-info.log');
    private logUrlError = path.resolve(__dirname,'../logs/backend-error.log');

    private constructor() {
        this.logger = bunyan.createLogger({
                name: 'backend',
                serializers: {
                    err: bunyan.stdSerializers.err,
                },
                streams: [{
                        type: 'rotating-file',
                        level: 'info',
                        path: this.logUrlInfo,
                        period: '1d', // daily rotation
                        count: 7,
                    },
                    {
                        type: 'rotating-file',
                        level: 'error',
                        path: this.logUrlError,
                        period: '1d', // daily rotation
                        count: 7
                    }
                ]
            })
    }

    static getInstance = () => {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

}

export default Logger.getInstance().logger;