const { MongoClient } = require('mongodb');

async function run() {
  try {
    const client = new MongoClient('mongodb://localhost:27017');
    await client.connect();
    console.log('✅ MongoDB connected successfully!');
    await client.close();
  } catch (err) {
    console.log('❌ Error:', err.message);
  }
}
run();