const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");
// const myCustomJoi = Joi.extend(require('joi-phone-number'));

const userSchema = new mongoose.Schema({
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	email: { type: String, required: true },
	number: {type: Number, required : true},
	password: { type: String, required: true },
	cpassword: { type: String, required: true },
});

userSchema.methods.generateAuthToken = function () {
	const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
		expiresIn: "7d",
	});
	return token;
};

const User = mongoose.model("user", userSchema);

const validate = (data) => {
	const schema = Joi.object({
		firstName: Joi.string().required().label("First Name"),
		lastName: Joi.string().required().label("Last Name"),
		email: Joi.string().email().required().label("Email"),
		number: Joi.string().regex(/^[0-9]{10}$/).messages({'string.pattern.base': `Invalid Phone number.`}).required(),
		password: passwordComplexity().required().label("Password"),
		cpassword: Joi.string().required().valid(Joi.ref('password')).messages({'string.pattern.base': `Password mismatch.`}),
	});
	return schema.validate(data);
};

module.exports = { User, validate };
