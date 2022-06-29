import mongoose from 'mongoose';


export const conn=async(username,password)=>{
const URL=`mongodb+srv://${username}:${password}@myntra.t29yucb.mongodb.net/?retryWrites=true&w=majority`

    try {
       await mongoose.connect(URL,{useNewUrlParser:true,useUnifiedTopology:true})
        console.log('connected to mongo');
    } catch (error) {
        console.log('error in conn',error.message);
    }
 
}
