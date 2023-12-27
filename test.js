const { MongoClient } = require('mongodb');

// Connection URI
const uri = 'mongodb://${LocalIPv4()}:27017/your-database-name';

// Create a new MongoClient
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Connect to the MongoDB server
client.connect((err) => {
    if (err) {
        console.error('Error connecting to MongoDB:', err);
        return;
    }

    console.log('Connected to MongoDB');
});

// Handle errors
client.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

// Close the connection when the Node.js process is terminated
process.on('SIGINT', () => {
    console.log('Closing MongoDB connection...');
    client.close(() => {
        console.log('MongoDB connection closed.');
        process.exit(0);
    });
});
