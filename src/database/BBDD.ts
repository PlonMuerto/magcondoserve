import {connect} from 'mongoose'

const MongoAtlas = String(process.env.MONGODB_URI) 

connect(MongoAtlas , {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  useCreateIndex: true,
}).then(db => console.log('DB is connected')).catch(err => console.error(err));