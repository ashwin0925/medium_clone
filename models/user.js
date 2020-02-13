var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcyrpt = require('bcrypt');

var userSchema = new Schema({
  name:{
    type: String,
    required: true
  },
  email:{
    type: String,
    lowercase: true,
    required: true,
    unique: true,
    match: /\S+@\S+\.\S+/
  },
  username:{
    type: String,
    unique: true
  },
  password:{
    type: String,
    minlength: 4,
    required: true,
    trim: true
  },
  commentsId:{
type: Schema.Types.ObjectId,
ref:'Comment'
  },
  
}, {timestamps: true});

userSchema.pre('save', function(next) {
  if(this.password && this.isModified('password')) {
    this.password = bcyrpt.hashSync(this.password, 10);
  }
  next();
})

userSchema.methods.verifyPassword = function(password){
  return bcyrpt.compareSync(password, this.password)
}



module.exports = mongoose.model('User', userSchema)