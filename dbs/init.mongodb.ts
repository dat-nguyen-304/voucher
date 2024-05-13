import mongoose from 'mongoose';

const connectString: string = `mongodb+srv://dathdws:122711@cluster0.rfjmz3q.mongodb.net/`;

class Database {
    private static instance: Database;

    private constructor() {
        this.connect();
    }

    private connect(): void {
        // mongoose.set('debug', true);
        // mongoose.set('debug', { color: true });
        mongoose
            .connect(connectString)
            .then(() => console.log(`Connected to MongoDB successfully`, mongoose.connections.length))
            .catch(err => console.error('Error', err));
    }

    public static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
}

const mongoDbInstance: Database = Database.getInstance();

export default mongoDbInstance;
