var mongoose= require("mongoose");

// var commentSchema = new mongoose.Schema({
//     text: String,
//     author: String
// });

var commentSchema = new mongoose.Schema({ // instead of in comment author being a simple string it has id and username with id referenced to a user 
    text: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

module.exports= mongoose.model("Comment", commentSchema);