import mongoose from 'mongoose'

mongoose.connect("mongodb://localhost:27017/magcondo", {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  useCreateIndex: true,
}).then(db => console.log('DB is connected')).catch(err => console.error(err));