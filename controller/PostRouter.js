require('dotenv').config()
const express = require('express')
const mysql = require('mysql2')
const router = express.Router();
const nodemailer = require('nodemailer')
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.dbpassword,
    database: 'blog-db'
})

connection.connect(function (err) {
    if (err) {
        console.log('error connection ' + err.stack)
        return;
    }
    console.log('connected as id ' + connection.threadId);
})
router.get('/', (req, res) => {
    res.send({
        status: 200,
        message: "Hello from post"
    })
})


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'paljitendra9171@gmail.com',
        pass: process.env.gmailPassword
    }
});





1 // save new post
router.post('/save-post', async (req, res) => {

    const { id, title, description, author } = req.body
    const sql = `INSERT INTO post VALUES(${id},'${title}','${description}',${author})`;
    connection.query(sql, function (err, result) {
        if (err) {
            console.log(err.message);
            return res.send({
                status: 401,
                message: "Database error",
                err: err.message
            })
        }
        else {
            createPost = result
        }
    })



    let mailOptions = {}
    const sqlGetEmail = `select email from author where 'author-id' !=${author}`;
    connection.query(sqlGetEmail, function (err, results) {
        if (err) {
            return res.send({
                status: 402,
                message: "Some Database error, Please try again",
                error: err.message
            })
            
        }
        else {
            console.log(results + "hiii");
            mailOptions = {
                from: 'paljitendra9171@gmail.com',
                to: results.map(email=>{
                    return email.email
                }),
                subject: `New post created by ${author}`,
                text: "Hi ,a new post has been created ,please check "
            }
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                    return res.send({
                        status: 400,
                        message: 'error in sending mail'
                    })
                }
                else {
                    console.log('Email sent: ' + info.response)
                    return res.send({
                        status: 200,
                        message: 'post saved successfully'
                    })
                }
            })
        }
    })
   
    
})



// 2. Update each post using post id.

router.post('/update-post', (req, res) => {

    const { id, title, description } = req.body;
    console.log(id, title, description);
    const sql = `UPDATE post set title='${title}', description='${description}' where id=${id}`;
    connection.query(sql, function (err, result) {
        if (err) {
            console.log(err.message);
            return res.send({
                status: 401,
                message: "Database error",
                err: err.message
            })
        }
        else {
            return res.send({
                status: 200,
                message: 'data updated successfully',
                data: result
            })
        }
    })
})


3// get all posts
router.get('/get-all-post', (req, res) => {

    const sql = 'select * from post';
    connection.query(sql, function (err, results) {
        if (err) {
            return res.send({
                status: 402,
                message: "Some Database error, Please try again",
                error: err.message
            })
        }
        else {
            return res.send({
                status: 200,
                message: "Data fetched successfully",
                data: results
            })
        }
    })
})


// 4. Get all posts by author id.
router.get('/get-post-author/:author', (req, res) => {
    const author = parseInt(req.params.author)
    console.log(author);
    const sql = `select * from post where author=${author}`;
    connection.query(sql, function (err, results) {
        if (err) {
            return res.send({
                status: 402,
                message: "Some Database error, Please try again",
                error: err.message
            })
        }
        else {
            return res.send({
                status: 200,
                message: "Data fetched successfully",
                data: results
            })
        }
    })
})


// 5 .Delete post by id.

router.get('/delete-post/:id', (req, res) => {
    const id = parseInt(req.params.id)
    console.log(id);
    const sql = `delete from post where id=${id}`;
    connection.query(sql, function (err, results) {
        if (err) {
            return res.send({
                status: 402,
                message: "Some Database error, Please try again",
                error: err.message
            })
        }
        else {
            return res.send({
                status: 200,
                message: "deleted successfully",
                data: results
            })
        }
    })
})




// 6. On saving each post, a mail notification about the post should be sent to all other authors.
// 


module.exports = router