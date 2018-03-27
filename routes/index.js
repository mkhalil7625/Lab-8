var express = require('express');
var router = express.Router();
var Task = require('../models/task');
/* GET home page, list of incomplete tasks. */
router.get('/', function(req, res, next) {
  Task.find({completed:false})
      .then((docs)=>{
          res.render('index', { title: 'Incomplete tasks', tasks:docs });
      })
      .catch((err)=>{
        next(err);
      })
});
//post to create a new tsk
router.post('/add', function (req,res,next) {


//create new task
    //check if something was entered in the text input
    if (req.body.text) {

        var t = new Task({text: req.body.text, completed: false})
//save the task and redirect to home page if successful
        t.save().then((newTask) => {
            console.log('The new task created is ', newTask);
            res.redirect('/');// create a get request to home page '/'
        }).catch(() => {
            next(err);
        });
    }
    else{
      res.redirect('/');//else ignore and redirect to home page
    }
});
//post to mark a task as done
router.post('/done', function (req, res, next) {
    Task.findByIdAndUpdate(req.body._id,{completed:true})
        .then((originalTask)=>{
          //originalTask only has a value if a document with this_id was found
            if(originalTask){
              res.redirect('/');

            }else{
              var err=new Error('Not Found');//report task not found with 404
                err.status=404;
                next(err);
            }
        })
        .catch((err)=>{
          next(err);
        });
});
//get completed tasks
router.get('/completed',function (req, res, next) {
    Task.find({completed:true})
        .then((docs)=>{
          res.render('completed_tasks',{tasks:docs});
        })
        .catch((err)=>{
          next(err);
        });
});
//post to  delete a task
router.post('/delete',function (req, res, next) {
    Task.findByIdAndRemove(req.body._id)
        .then((deletedTask)=>{
          if(deletedTask){
            res.redirect('/');
          }else{
            var error=new Error('Task not found')
              error.status=404;
            next(error);
          }
        })
        .catch((err)=>{
          next(err);
        });
});
router.post('/alldone',function (req, res, next) {
    Task.updateMany({completed:false},{completed:true})
        .then(()=>{
          res.redirect('/');
        })
        .catch((err)=>{
          next(err);
        });
});
router.get('/task/:_id', function (req, res, next) {
    Task.findById(req.params._id)
        .then((doc)=>{
          if(doc){
            res.render('task',{task:doc});
          }
          else{
            next();//to the 404 handler
          }
        })
        .catch((err)=>{
          next(err);
        });
});
module.exports = router;
