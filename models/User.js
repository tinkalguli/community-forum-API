const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

let userSchema = new Schema({
    username : { type : String, unique : true, required : true },
    name : String,
    email : { type : String, unique : true, required : true },
    password : { type : String, required : true },
    bio : String,
    image : String
}, { timestamps : true });

userSchema.pre("save", function(next) {
    if (this.password) {
        bcrypt.hash(this.password, 12, (err, hash) => {
            if (err) return next(err);
            this.password = hash;
            next();
        });
    } else {
        next();
    }
});

userSchema.methods.verifyPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

module.exports = model("User", userSchema);