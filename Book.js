var mongoose = require('mongoose');
var url = "mongodb://127.0.0.1/myDatabase-2";
mongoose.set('useCreateIndex', true);
mongoose.connect(url, { useNewUrlParser: true,useUnifiedTopology: true},function(err, db) {
    if(err) {
        console.log(err);
    }
    else {
        console.log('connected to ' + url);
    }
});
var Schema = mongoose.Schema;
var authorSchema = new Schema({
    name: String,
    affiliation: String
});
var bookSchema = new Schema({
    title : {type: String, required : true, unique: true},
    year : Number,
    authors : [authorSchema]
});
//module.exports = mongoose.model('Book',bookSchema);