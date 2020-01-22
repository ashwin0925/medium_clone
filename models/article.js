var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var articleSchema = new Schema({
  title:{
    type: String,
    required: true,
    minlength:2
  },
  description:{
    type: String,
    required: true,
    minlength:2
  },
  tags:[{
    type: String,
    required: true,
    minlength:2
  }],
  likes:{
    type:Number,
    default:0
  },
  Comments: [{
    type: Schema.Types.ObjectId,
    ref:"Comment"
  }],
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {timestamps: true});

module.exports = mongoose.model('Article', articleSchema)