var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Define a schema-What fields will a task document have?

var taskSchema = new Schema({
    text: String,
    completed:Boolean
});
//compile tskschema description into a mongoose model
//with the name'task'

var Task = mongoose.model('Task',taskSchema);

//Export the Task model for use
module.exports=Task;