const express= require('express')
const mysql = require('mysql2')
const router= express.Router();

const connection= mysql.createConnection({
    host: 'localhost',
    user : 'root',
    password :'welcome1234',
    database: 'blog-db'
})

connection.connect(function(err){
    if(err)
    {
        console.log('error connection ' +err.stack )
        return;
    }
    console.log('connected as id ' +connection.threadId);
})
router.get('/',(req,res)=>{
    res.send({
        status:200,
        message:"Hello from post"
    })
})

1 // save new post
router.post('/save-post',(req,res)=>{
    
    const {id,title,description,author}= req.body
    const sql = `INSERT INTO post VALUES(${id},'${title}','${description}',${author})`;
    connection.query(sql,function(err,result){
        if(err)
         {
             console.log(err.message);
             return res.send({
                 status:401,
                 message:"Database error",
                 err:err.message
             })
         }
         else
         {
          return res.send({
                status:200,
                message:'post saved successfully',
                data :result
            })
         }
    })
})



// 2. Update each post using post id.

router.post('/update-post',(req,res)=>{
    
    const {id,title,description}= req.body;
    console.log(id,title,description);
    const sql = `UPDATE post set title='${title}', description='${description}' where id=${id}`;
    connection.query(sql,function(err,result){
        if(err)
         {
             console.log(err.message);
             return res.send({
                 status:401,
                 message:"Database error",
                 err:err.message
             })
         }
         else
         {
          return res.send({
                status:200,
                message:'data updated successfully',
                data :result
            })
         }
    })
})


3// get all posts
router.get('/get-all-post',(req,res)=>{

    const sql='select * from post';
    connection.query(sql,function(err,results){
        if(err)
        {
            return res.send({
                status:402,
                message:"Some Database error, Please try again",
                error:err.message
            })
        }
        else
        {
            return res.send({
                status:200,
                message:"Data fetched successfully",
                data:results
            })
        }
    })
})


// 4. Get all posts by author id.
router.get('/get-post-author/:author',(req,res)=>{
    const author= parseInt(req.params.author)
    console.log(author);
    const sql = `select * from post where author=${author}`;
    connection.query(sql,function(err,results){
        if(err)
        {
            return res.send({
                status:402,
                message:"Some Database error, Please try again",
                error:err.message
            })
        }
        else
        {
            return res.send({
                status:200,
                message:"Data fetched successfully",
                data:results
            })
        }
    })
})


// 5 .Delete post by id.

router.get('/delete-post/:id',(req,res)=>{
    const id= parseInt(req.params.id)
    console.log(id);
    const sql = `delete from post where id=${id}`;
    connection.query(sql,function(err,results){
        if(err)
        {
            return res.send({
                status:402,
                message:"Some Database error, Please try again",
                error:err.message
            })
        }
        else
        {
            return res.send({
                status:200,
                message:"deleted successfully",
                data:results
            })
        }
    })
})

module.exports= router