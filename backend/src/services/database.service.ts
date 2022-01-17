import { connect, ConnectOptions, set } from 'mongoose';

class DatabaseService {
    private static instance: DatabaseService;

    static getInstance = async () => {
        if (!DatabaseService.instance) {
            DatabaseService.instance = new DatabaseService();
            await DatabaseService.dbConnect();
        }
        return DatabaseService.instance;
    };

    static dbConnect = async () => {
        // TODO - what options??
        const options: ConnectOptions = {
            autoIndex: false, // Don't build indexes
            maxPoolSize: 10, // Maintain up to 10 socket connections
            serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        }

        connect(`${process.env.MONGO_CONNECTION_STRING}`, options)
            .then(() => console.log(`Mongo connected.`))
            .catch(err => console.log(err));
            
    };  

}

export default DatabaseService;