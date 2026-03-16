const validator = require('validator')

function validUserLogin(data){

   if (!data.email || !validator.isEmail(data.email))
        throw new Error("Invalid Email");

    if(!data.password)
        throw new Error("Password is required")
}

module.exports = validUserLogin;