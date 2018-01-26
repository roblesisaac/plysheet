var restful = require('node-restful');
var mongoose = restful.mongoose;

var siteSchema = new mongoose.Schema({
    name: String,
    userId: String,
    url: { type: String, unique: true }
});

module.exports = restful.model('site', siteSchema);
