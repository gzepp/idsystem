import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'


dotenv.config()
//Generate JWT

const generateToken = (id) =>{

return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:'10d',})

}

export default generateToken;