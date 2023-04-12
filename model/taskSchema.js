import mongoose from 'mongoose'

const taskSchema = new mongoose.Schema({
    task:{
        type:String,
        required:true,
        min:3
    },
    status:{
        type:String,
        required:true,
        default:"pending"
    },
    priority:{
        type: Number,
        required: true,
        min: [1, "Priority must be at least 1"],
        max: [9, "Priority must be at most 9"]
    }

})


const Task = mongoose.model('Task', taskSchema);

export default Task;