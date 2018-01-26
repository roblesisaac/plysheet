// get an instance of mongoose and mongoose.Schema
var restful = require('node-restful');
var mongoose = restful.mongoose;
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);

var userSchema = new mongoose.Schema({
    username: {type: String, unique: true},
    name: { type: String, lowercase: true, trim: true },
    password: String
});

userSchema.pre('save', function (next) {
  var user = this;

  // only hash password if it's been modified
  if (!user.isModified('password')) return next();

  // hash the password using our new salt
  bcrypt.hash(user.password, salt, function (err, hash) {
    if (err) return next(err);

    // override the cleartext password with the hased
    user.password = hash;
    next();
  });
});

userSchema.methods.comparePassword = function (candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return callback(err);
    callback(undefined, isMatch);
  });
}

// set up a mongoose model and pass it using module.exports
module.exports = restful.model('User', userSchema);
