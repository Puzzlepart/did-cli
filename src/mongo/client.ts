require('dotenv').config()
import { MongoClient } from 'mongodb'

export const getClient = async (connectionString = process.env['MONGO_DB_CONNECTION_STRING'] as string) => {
  const client = await MongoClient.connect(
    connectionString,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  )
  return {
    client,
    db: client.db(process.env['MONGO_DB_DB_NAME'])
  }
}
