const express= require('express');
const app= express()
const PORT= process.env.PORT || 4000

app.use(express.json());
app.use(express.urlencoded({extended:true}))
const postRoute= require('./controller/PostRouter')

app.get('/',(req,res)=>{
    res.send("Hello application")
})

app.use('/post',postRoute)
app.listen(PORT,()=>{
    console.log(`server is running at port ${PORT}`);
})