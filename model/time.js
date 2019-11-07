const mongoose = require('mongoose');
const config = require('../config/database');

// User Schema
const UserSchema = mongoose.Schema ({

  user: {
    type: String,
    required: true
  },
  status: {
    type: Boolean,
    required: true
  },


  timein:{
      type:Date,
  },

  time:{
      type:Array
  }


});


const Time = module.exports = mongoose.model('Time', TimeSchema);

module.exports.getUserById = function(id, callback) {
  User.findById(id, callback);
}

module.exports.getUserByUsername = async function(username) {
  const query = {user: newUser.user}
  let time=await Time.findOne(query);
  console.log(user)
  return time
}

module.exports.addTime = async function(newUser) {
	
	try{
		const query = {user: newUser.user}
		let user=await User.findOne(query);
		console.log(user)
		
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
		console.log(user)
		
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