const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    firstName: {type: String, required: [true, 'First name is required']},
    lastName: {type: String, required: [true, 'Last name is required']},
    email: { type: String, required: [true, 'Email address is required'], unique: [true, 'This email address has been used'] },
    password: { type: String, required: [true, 'Password is required'] },
});

userSchema.pre('save', async function(){
    let user = this;
    if (!user.isModified('password'))
        return;
        
    try {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
    } catch(err) {
        throw err;
    }
});

userSchema.methods.comparePassword = function(inputPassword) {
  let user = this;
  return bcrypt.compare(inputPassword, user.password);
}

//collection name is connections in the database
module.exports = mongoose.model('User', userSchema);