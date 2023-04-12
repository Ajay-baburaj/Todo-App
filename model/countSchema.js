import mongoose from 'mongoose'

const countSchema = new mongoose.Schema({
    count:{
        type:Number,
        default:0,
    },
    name:{
        type:String,
        default:"deleteCount"
    }
   

})


const Count = mongoose.model('Count', countSchema);

export default Count;