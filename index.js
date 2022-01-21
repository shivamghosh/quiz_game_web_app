const express = require("express");
const path = require("path");
const fs = require("fs");
const request = require('request');
const ejs=require('ejs');
const mongoose = require('mongoose');

//connecting to mongodb
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/QuizData');
}

//fixing path
app=express();
app.use(express.urlencoded());

//to use files in public
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

//function to display web page
async function getData()
{
    //fetching data from database
    const questions=await quesmodel.find();
    let ques=[];
    let ans=[];
    ques=questions;
    ques.forEach(object =>{
        ans.push(object['ans']);
        delete object['ans'];
    });
    // console.log(ques);
    // let ques=[{q:"First question",op1:"Option 1",op2:"Option 2",op3:"Option 3",op4:"Option 5"},{q:"First question",op1:"Option 1",op2:"Option 2",op3:"Option 3",op4:"Option 5"},{q:"First question",op1:"Option 1",op2:"Option 2",op3:"Option 3",op4:"Option 5"}];
    // let ans=["Option 1","Option 2","Option 2"];
    let score='';
    let greet='Welcome Guest, Choose one option to answer each question. Good luck :)';
    var data={name:greet,question:ques,score:score,showsubmit:"Y",iscorrect:[],userres:[],correctans:[],responses:[]};
    app.get('/', (req, res)=>{
    res.render('home', {data:data});
     });
    app.get('/about', (req, res)=>{
    res.render('about');
    });
    app.get('/help', (req, res)=>{
    res.render('help');
    });
    app.get('/contact', (req, res)=>{
    res.render('contact');
    });
    app.post('/', (req,res)=>{
        let responses=Object.values(req.body);
        let sc=0;
        let iscorrect=[],userres=[],correctans=[];
        for(i=0;i<responses.length;i++)
        {
            if(responses[i]==ans[i])
            {
            sc=sc+1;
            iscorrect[i]='Correct!!!';
            }
            else
            iscorrect[i]='Wrong!!!';
            userres[i]=responses[i];
            correctans[i]=ans[i];

        }
        score="Your score is: "+sc.toString()+" out of "+ans.length.toString();
        var data={question:ques,score:score,showreset:"Y",iscorrect:iscorrect,userres:userres,correctans:correctans,showsubmit:"N",responses:responses};
        res.render('home', {data:data});
    })
}

//Declaring schema
const quesSchema= new mongoose.Schema({
    ques: String,
    op1: String,
    op2: String,
    op3: String,
    op4: String,
    ans: String
});

//creating model
const quesmodel=mongoose.model('quesan',quesSchema);

//calling funstion to display web page
getData();
   
    var server = app.listen(4000, function(){
        console.log('listening to port 4000')
    });