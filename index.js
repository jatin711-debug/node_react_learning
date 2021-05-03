var express = require('express');
var app = express();
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended : true}));
app.set('view engine','ejs');
//var Book = require('./Book.js');
var Person = require('./Person.js');

function searchAny(req,res){
    var terms = [];
    if(req.body.title){
        terms.push({ title :{  $regex : req.body.title }});
    }
    if(req.body.year){
        terms.push({ year : req.body.year });
    }
    if(req.body.name){
        terms.push({ 'authors.name' : req.body.name })
    }

    var query = { $or : terms };
    console.log(query);

    Book.find(query,(err,books) =>{
        if(err){
            res.type('html').status(500);
            res.send('error' + err);
        }
        else{
            res.render('books',{books : books});
        }
    });
}
function searchAll(req,res){
    var query = {};
    if(req.body.title) query.title = req.body.title;
    if(req.body.year) query.year = req.body.year;
    if(req.body.name) {
        query['authors.name'] = req.body.name;
    }
    console.log(query);
    Book.find(query,(err,books) =>{
        if(err){
            res.type('html').status(500);
            res.send('error'+ err);
        }
        else{
            res.render('books',{books : books});
        }
    }).sort({'title' :'asc'});
}
var logger = (req,res,next) => {
    var url = req.url;
    var time = new Date();
    console.log('Received mssg req for '+ url + ' at '+ time );
    next();
}

var nameFinder = (req,res,next) => {
    var name = req.query.name;
    if(name) req.username = name.toUpperCase();
    else req.username = 'Guest';
    next();
}

var greeter = (req, res, next) => {
    res.status(200).type('html');
    res.write('helllo'+ req.username);
    next();
}
var admin = (req, res, next) => {
    req.username ='Admin'
    next();
}
var anonmyous = (req, res, next) => {
    req.username ='anoy'
    next();
}
var defaulter = (req, res, next) => {
    req.username ='Defaulter'
    next();
}


var commonRoute = express.Router();
commonRoute.use(nameFinder,greeter,anonmyous,defaulter); //use to apply common middlewares at same time 

app.use('/public',logger,express.static('files'));
/*app.use('/welcome',nameFinder,commonRoute,(req, res) => { res.end(); })
app.use('/admin',admin,commonRoute,(req, res) => { res.end(); })
app.use('/infos',(req, res) => {
    var query = req.query;
    var name = query.name;
    var location = query.location;

    res.status(200).send('Hello '+name+' from '+location);
}) */
//app.use('/',(req,res) =>{
 //res.redirect('index2.html');
//})

    app.use('/handel_main_page',(req,res) =>{

        var newPerson = new Person({
            name: req.body.name,
            age: req.body.age,
        });
        newPerson.save( (err) => {
            if(err){
                res.type('html').status(500);
                res.send('Error'+ err);
            }
            else{
                res.render('created',{person : newPerson})
            }
        })
    })
    app.use('/all',(req,res) =>{
        Person.find((err,allPeople)=> {
            if(err){
                res.type('html').status(500);
                res.send('Error'+ err);
            }
            else if(allPeople.length == 0){
                res.type('html').status(200);
                res.send('There are no records');
            }
            else{
                res.render('showAll',{people: allPeople});
            }
        });
    });

//app.use('/ezy',(req,res) =>{
  //  res.render('welcome',{username : 'Johnny', isGoD : true});
//})

/*app.use('/name/:userName/location/:userLocation',(req, res) => {
    var params = req.params;
    var name = params.userName;
    var location = params.userLocation;
    var length = Object.keys(params).length;
    res.status(200).send('Hello '+name+' from '+location);
}) */
 /* app.use('/about',(req, res) => {
 res.send('This is html page');
res.send('Hello World');
});
app.use('/login',(req, res) => {
    res.send('This is login page');
   }); */
   //app.use(/*default*/ (req, res) => {
  //  res.status(200).sendFile(__dirname + 'indices.html');
   //}); 
   app.use('/person',(req,res) =>{
    var searchName = req.query.name;
    Person.findOne({name : searchName},(err,person) => {
        if(err){
            res.type('html').status(500);
            res.send('Error'+ err);
        }
        else if(!person){
            res.type('html').status(200);
            res.send('No person named'+ searchName+' was found');
        }
        else{
            res.render('personInfo',{person : person});
        }
    });
   });
   app.use('/update',(req,res) =>{
    var updateName = req.body.username;
    Person.findOne({name : updateName},(err,person) =>{
        if(err){
            res.type('html').status(500);
            res.send('error',err);
        }
        else if(!person){
            res.type('html').status(200);
            res.send('No person was found'+updateName);
        }
        else{
            person.age = req.body.age;
            person.save((err) =>{
                if(err){
                    res.type('html').status(500);
                    res.send(err);
                }
                else{
                    res.render('updated',{person : person});
                }
            })
        }
    });
   });

   app.use('/createBook',(req,res) => {
    console.log(req.body);
    var newBook = new Book(req.body);
    newBook.save((err) =>{
        if(err){
            res.type('html').status(500);
            res.send('error'+err)
        }
        else {
            res.render('created-2',{book : newBook});
        }
    });
   });

  /*
  // This one is will be used to search on all creteria
  app.use('/search',(req,res) =>{
    var query = {};
    if(req.body.title) query.title = req.body.title;
    if(req.body.year) query.year = req.body.year;
    if(req.body.name) {
        query['authors.name'] = req.body.name;
    }
    console.log(query);
    Book.find(query,(err,books) =>{
        if(err){
            res.type('html').status(500);
            res.send('error'+ err);
        }
        else{
            res.render('books',{books : books});
        }
    });
   }); */

   app.use('/search',(req,res) =>{
    if(req.body.which =='any'){
        searchAny(req,res);
    }
    if(req.body.which == 'all'){
        searchAll(req,res);
    }
    else{
        searchAll(req,res);
    }
   });

app.listen(3000,() =>{
    console.log('Listening on port 3000');
});


