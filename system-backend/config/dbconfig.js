import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config();

const URI = process.env.MONGO_URI

const  dbConfig = async () => {
try {
    await mongoose.connect(URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })

    console.log('MongoDB Connected')
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}


export default dbConfig





// function dbConfig() {

//     mongoose.connect(URI)
// .then(()=>{
//     console.log('db conneted');

// })
// .catch((error) =>{
//     console.log(error);
// })

    
// }

// export default dbConfig
