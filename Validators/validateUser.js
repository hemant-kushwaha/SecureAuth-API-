const validator = require('validator')

function validUser(data){

    if(!data.name)
        throw new Error("Name is required")

   if (!data.email || !validator.isEmail(data.email))
        throw new Error("Invalid Email");

    if(!data.password)
        throw new Error("Password is required")
    if(!validator.isStrongPassword(data.password))
        throw new Error ("Weak Password")

    const allowedGenders = ["Male", "Female", "Other"];
    if (!data.gender || !allowedGenders.includes(data.gender))
        throw new Error("Invalid Gender");


}

module.exports = validUser;