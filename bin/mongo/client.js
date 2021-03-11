require('dotenv').config()
const { MongoClient } = require('mongodb')

const getClient = async () => {
  const client = await MongoClient.connect(
    process.env.MONGO_DB_CONNECTION_STRING,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  )
  return {
    client,
    db: client.db(process.env.MONGO_DB_DB_NAME)
  }
}

module.exports = { getClient }
