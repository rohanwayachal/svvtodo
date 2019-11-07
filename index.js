const express = require('express')
const path = require('path')
const app = express()
const bodyParser = require('body-parser');
const jwt=require('jsonwebtoken');
const ejs=require('ejs');
 const cors=require('cors')
 const mongoose = require('mongoose');
 const config = require('./config/database');

mongoose.connect(config.database,{useNewUrlParser: true});
// On Connection
mongoose.connection.on('connected', () => {
  console.log('Connected to Database '+config.database);
});
// On Error
mongoose.connection.on('error', (err) => {
  console.log('Database error '+err);
});



app.use(bodyParser.urlencoded({ extended: false }))
// Body Parser Middleware
app.use(bodyParser.json());

app.use(cors())

app.set('views',path.join(__dirname,'views'))
app.set('view engine','ejs')
app.use(express.static(path.join(__dirname, 'public')));

 



const User = require('./model/user');



function auth(req,res,next){

	const token=req.header('auth-token');
	if (!token) return res.status(401).send("access denied")

	try{

		const ver=jwt.verify(token,"secret")
		req.user=ver
		next();

	}
	catch(err){
		res.status(400).send("Invalid token")
	}


}

app.get('/', function (req, res) {
  res.render('index')
})

app.post('/login', async function (req, res) {
  	let newUser = new User({
    user: req.body.user,
    pass: req.body.pass,
	});
	
	let valid=await User.loginUser(newUser)


		
	if(valid===true)
	{
		const token=jwt.sign({user:req.body.user},"secret")
		res.header('auth-token',token)
		//res.send("hello")
		res.json({"data":true})
	}
	else
	res.json({"data":valid})	
})




app.post('/home',async function (req, res) {


	let newUser = new User({
		user: req.body.user,
		pass: req.body.pass,
		});
		
	let valid=await User.loginUser(newUser)
	
	
			
	if(valid===true)
	{
			const token=jwt.sign({user:req.body.user},"secret")
			res.header('auth-token',token)
			//res.send("hello")
			res.render('home',{user:req.body.user,token})
	}
	else
		res.json({"data":valid})
})



app.get('/home', auth,function (req, res) {
  res.render('home')
})

app.get('/register', function (req, res) {
  res.render('register')
})


app.post('/register',async function (req, res) {
	

	let newUser = new User({
    user: req.body.user,
    pass: req.body.pass,
	});
	
	
	let valid=await User.addUser(newUser)
	
	
	if(valid===true)
	res.json({"data":true})
	else
	res.json({"data":valid})
	
})



app.get('/data',auth ,async function (req, res) {
	//res.render('register')

	let time=await User.getUserByUsername(req.user);
	res.json(time);
})


app.post('/addtodo',auth ,async function (req, res) {
	//res.render('register')

	let todo={
		user:req.user.user,
		title:req.body.title,
		desc:req.body.desc
	}

	let todos=await User.addTodo(todo)

	res.json(todos);
})

app.post('/deletetodo',auth ,async function (req, res) {
	//res.render('register')


	let todo={
		user:req.user.user,
		id:req.body.id
	}

	let todos=await User.deleteTodo(todo)





	res.send("ok")


})


  
 
app.listen(8080)
