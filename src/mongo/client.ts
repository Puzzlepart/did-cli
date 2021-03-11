require('dotenv').config()
import { MongoClient } from 'mongodb'

export const getClient = async () => {
  const client = await MongoClient.connect(
    process.env['MONGO_DB_CONNECTION_STRING'] as string,
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