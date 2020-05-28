/*jshint esversion: 6 */
const express =require("express");
//Helps to take the http request. Used to take the API's
const https=require("https");
//Helps to take the post requiest form the forms of HTML
const bodyParser=require("body-parser");
const ejs=require("ejs");
const request=require("request");
var unirest = require("unirest");
const axios = require("axios");

const app =express();
app.use(express.static("public"));
//initializing body bodyParser
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine','ejs');

//The website gets index.html when its in the root route
app.get("/",function(req,res){
  res.sendFile(__dirname+"/home.html");
});
app.get("/post",function(req,res){
  res.sendFile(__dirname+"/post.html");
});
app.get("/projects",function(req,res){
  res.sendFile(__dirname+"/myProjects.html");
});
app.get("/about",function(req,res){
  res.sendFile(__dirname+"/about.html");
});
app.get("/contact",function(req,res){
  res.sendFile(__dirname+"/contact.html");
});
app.get("/weather",function(req,res){
  res.render('index');
});
app.get("/number",function(req,res){
    res.render('number', { quote:"", year:""});
});

app.get("/corona",function(req,res){
  res.render('corona');
});
app.get("/signup",function(req,res){
  res.render('signup');
});




app.post("/weather",function(req,res){
  //Making our inputs dynamic
  //Form our root route we are reqesting the form input that has name cityName
  const city =req.body.cityName;
  const apiKey="1fe69d9ae40548a7e900a741a10c6f09#";
  const unit="metric";

  const url="https://api.openweathermap.org/data/2.5/weather?q="+city+"&appid=";
//Gets the response from the urs
  https.get(url,function(response){
//The response we get from the url is stored in data variable
    response.on("data",function(data){
//The data is formatted in JSON format and stored in weatherData varialbe
    const weatherData=  JSON.parse(data);

//Extracting the temp data, description and icon form the weather data
    const temp=weatherData.main.temp;
    const weatherDescription=weatherData.weather[0].description;
    const icon=weatherData.weather[0].icon;

//URL for the weather icon. We need to pass in the icon ID

    const imageURL="http://openweathermap.org/img/wn/"+icon+"@2x.png";

//Sending all the dat to the website
res.write("<p> The weather is currently "+weatherDescription+" in "+ city+"</P>");
res.write("<h1> The Temperature is "+ temp+ " degree Farenheight</p>");
res.write("<img src="+ imageURL +">");
res.send();


    });
  });

});




app.post("/number",function(req,res){

  const number_val=req.body.number;
  axios({
    "method":"GET",
    "url":"https://numbersapi.p.rapidapi.com/"+number_val +"/year",
    "headers":{
    "content-type":"application/octet-stream",
    "x-rapidapi-host":"numbersapi.p.rapidapi.com",
    "x-rapidapi-key":"",
    "useQueryString":true
    },"params":{
    "fragment":"true",
    "json":"true"
    }
    })
    .then((response)=>{
      console.log(response.data.text);
      res.render('number', { quote: response.data.text, year:response.data.number });
    })
    .catch((error)=>{
      console.log(error);
    });

  });



  app.post("/corona",function(req,res){

    const country=req.body.countryName;

    axios({
    "method":"GET",
    "url":"https://covid-19-data.p.rapidapi.com/country",
    "headers":{
    "content-type":"application/octet-stream",
    "x-rapidapi-host":"covid-19-data.p.rapidapi.com",
    "x-rapidapi-key":"",
    "useQueryString":true
    },"params":{
    "format":"json",
    "name":country
    }
    })
    .then((response)=>{
      const name=response.data[0].country;
      const conformed=response.data[0].confirmed;
      const recovered=response.data[0].recovered;
      const critical=response.data[0].critical;
      const death=response.data[0].deaths;
      const update=response.data[0].lastUpdate;


      res.render('results',{ Name: name, Conformed:conformed,Recovered:recovered,Critical:critical,Death:death,Update:update });
    })
    .catch((error)=>{
      console.log(error);
    });
    });




    app.post("/signup",function(req,res){
      //Getting the first name, lastname and email from our html page
      const firstName=req.body.fname;
      const lastName=req.body.lname;
      const email=req.body.email;
      console.log(firstName,lastName,email);

      const data={
        members:[
          {
          email_address:email,
          status:"subscribed",
          merge_fields:{
            FNAME:firstName,
            LNAME:lastName
          }
          }
        ]

      };
      const jsonData=JSON.stringify(data);
      const url="https://us18.api.mailchimp.com/3.0/lists/";

      const options={
        method:"POST",
        auth:"manandhar17:"
      };
      const request= https.request(url,options,function(response){
        if (response.statusCode ==200){
          res.render('success');
        }
        else{
          res.render('failure');
        }

        response.on("data",function(data){
          console.log(JSON.parse(data));
        });
      });
      request.write(jsonData);
      request.end();
    });

app.listen(process.env.PORT || 3000,function(){
  console.log("Server is running on port 3000.");
});
