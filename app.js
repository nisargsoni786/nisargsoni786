var express = require('express'); 
var path=require('path')
const bodyParser=require('body-parser')
var app = express(); 
const nodemailer=require('nodemailer');
var PORT = 3000; 
const mongoose=require('mongoose');

mongoose.connect('mongodb://localhost:27017/jsn',{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>console.log("connection successful......"))
.catch((err)=>console.log(err))

const playlistSchema=new mongoose.Schema({
    email:String,
    subject:String,
    name:String
})

const Playlist=new mongoose.model('mailacc',playlistSchema);

app.set('view engine','hbs');

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json());
 
const transporter=nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:'nisargsoni654321@gmail.com',
        pass:'Chhaya@1410'
    }
})

const sendemail= (mail)=>{

    var mailOption={
        from:'nisargsoni654321@gmail.com',
        to:mail.to,
        subject:mail.subject,
        html:"Hii" + mail.body + " Thank you for joining"
    }

    const createdoc=async ()=>{
    const data=[{
        email:mail.to,
        subject:mail.subject,
        name:mail.body
    }]
    const result=await Playlist.insertMany(data);
    console.log(result)
}
    createdoc();

    transporter.sendMail(mailOption,(err,info)=>{
        if(err) console.log(err)
        else    console.log('email sent' + info.response)
    })
}

app.post('/send_email_form',(req,res)=>{ 
    mail={
        to:req.body.to_address,
        subject:req.body.subject,
        body:req.body.email_body
    }



    sendemail(mail)
    res.redirect('/')
})

app.get('/',(req,res)=>{
    res.render('home')
})

app.listen(PORT, function(err){ 
    if (err) console.log("Error in server setup") 
    console.log("Server listening on Port", PORT); 
});
