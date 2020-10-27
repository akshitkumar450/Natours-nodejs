const fs=require('fs')
const express=require('express')
const app=express()

const tours=JSON.parse( fs.readFileSync(__dirname+'/dev-data/data/tours-simple.json','utf-8'))

app.get('/api/v1/tours',(req,res)=>{
    res.status(200).json({
        //JSend method
        status:'success',
        result:tours.length,
        data:{
            tours:tours
        }
    })
})




app.listen(4000,()=>{
    console.log('server started');
})