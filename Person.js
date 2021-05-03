var mongoose = require('mongoose');
var url = "mongodb://127.0.0.1/myDatabase";
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
var personSchema = new Schema({
    name : {type: String,required: true,unique: true},
    age : {type: Number,required: true },
});
module.exports = mongoose.model('Person',personSchema);