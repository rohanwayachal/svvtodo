const mongoose = require('mongoose');
const config = require('../config/database');

// User Schema
const UserSchema = mongoose.Schema ({

  user: {
    type: String,
    required: true
  },
  pass: {
    type: String,
    required: true
  },



  todos:{
      type:Array
  }
});


const User = module.exports = mongoose.model('User', UserSchema);


var ObjectId = mongoose.Types.ObjectId;

module.exports.addTodo =async function(todo) {

  const query = {user: todo.user}
  let user=await User.findOne(query); 

  user.todos.push({_id: new ObjectId(),title:todo.title,desc:todo.desc});
  return await user.save()


}

module.exports.deleteTodo =async function(todo) {

	const query = {user: todo.user}
	let id=todo.id





	let user=await User.findOne(query); 
	  user.todos=user.todos.filter((todo)=>todo._id!=id)

	  

	return await user.save()
  
  
  }




module.exports.getUserById = function(id, callback) {
  User.findById(id, callback);
}

module.exports.getUserByUsername = async function(newUser) {
  const query = {user: newUser.user}
  let user=await User.findOne(query);
  return user
}

module.exports.addUser = async function(newUser) {
	
	try{
		const query = {user: newUser.user}
		let user=await User.findOne(query);
		
		if (user!=null)
			return "User already exist"
		db_resp= await newUser.save();
		return true
		
	}
	
	catch(err)
	{
		console.log(err)
		return "error occured adding user"
	}

 
    
}

module.exports.loginUser = async function(newUser) {
	
	try{
		const query = {user: newUser.user}
		let user=await User.findOne(query);
		
		if (user==null)
			return "User Not Found"
	
		if(user.pass==newUser.pass)
			return true
		else 
			return "Password Invalid" 
	}
	
	catch(err)
	{
		console.log(err)
		return "error finding user"
	}
	
	 
}