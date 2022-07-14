const express=  require('express')
const app = express()
const mongoose = require('mongoose')
//const InfoModel = require('./models/info.js')
//import InfoModel from './models/info.js'
const cors = require('cors')
const {MongoClient} = require('mongodb');
const bodyParser=require('body-parser')
const router = express.Router()


var url = 'mongodb+srv://arhum:arhum@cluster0.ufeho.mongodb.net/?retryWrites=true&w=majority'

app.use(express.json())

app.use(
    cors({
        origin: "*",
    })
)
const data=[]
var completeDB={}

//CONNECTS TO MONGO DB 
MongoClient.connect(url, function (err, db) {
    if(err) throw err
    var dbo = db.db("test")
    dbo.collection('infos').find({}).toArray(function(err, result){
        if(err){
            throw err
        }else{
        console.log(result)
        completeDB=result
        //sendToFront(result)        
        
        /* for(var i = 0;i < result.length;i++){
            fillClass[i]
        } */
    }
    db.close()
})
})

//get data from customer Frontend -> backend
app.post('/', (req,res) => {
    //console.log(req.body)
    sendToDB(req.body)
    //sendToRestaurant(req.body)
    data.push(req.body)
    res.status(200).send({status:'recieved'})
})

//SENDS DATA FROM MONGO DB TO restaurant FRONTEND
 /* async function sendToFront(data){
     app.get('/getData', (request, response)=>{
        response.json(data)

    }) 
    
 }  */

 app.get('/getData', (request, response)=>{
    MongoClient.connect(url, function (err, db) {
        if(err) throw err
        var dbo = db.db("test")
        dbo.collection('infos').find({}).toArray(function(err, result){
            if(err){
                throw err
            }else{
            console.log(result)
            response.json(result)
            //sendToFront(result)        
            
            /* for(var i = 0;i < result.length;i++){
                fillClass[i]
            } */
        }
        db.close()
    })
    })
 })
 


//DELETE GUEST BASED ON PHONE NUM (req.body.id)
  app.post('/delete', function(req, res, next){

    MongoClient.connect(url, function (err, db) {
        if(err) throw err
        var dbo = db.db("test")
        dbo.collection('infos').findOneAndDelete({phoneNum:req.body.id}, function(err, result){
            if(err){
                throw err
            }else{
            console.log(result)
            
    
        }
        db.close()
    })
    })
 })

 //tell backend to send SMS message
 app.post('/text', function(req, res, next){
    sendSMS(req.body.phoneNum)
 })



 //SEND SMS via TWILIO
 function sendSMS(phoneNum){

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = require('twilio')("ACbaa8ad98c6c3dfde3f6ac2bda653d1b2", "b23cd6b3bc0c81fa51b632837541dbff");

    client.messages
    .create({
        body: 'Your table is ready!',
        from: '+19706388923',
        to: "+19255484242" 
        /* change the 'to' to {phoneNum} and get a real twilio Number */
    })
    .then(message => console.log(message.sid))
        .catch(e => { console.error('Got an error:', e.code, e.message); });
}

//sends customer frontend data to DB
function sendToDB(data){

    const sleep = (ms)=>{
    return new  Promise((resolve)=> setTimeout(resolve, ms))
    }

    const main = async()=>{
        await sleep(10000)
    }

     MongoClient.connect(url, function (err, db) {
        if(err) throw err
        var dbo = db.db("test")
        dbo.collection('infos').insertOne({fullName: data.fullName,
            phoneNum: data.phoneNum,
            numPeople: data.numPeople},function(err, result) {
                console.log(err)
            });
    }) 


}










//START  PORT 
app.listen(7004, () =>  {
    console.log("Server started on port 7004")
  /*   MongoClient.connect(url,
    { useNewUrlParser: true }, (error, result) =>{
        if(error) throw error
        result.db('test')
    }) */
})

