const bcrypt = require('bcrypt');

const encrypt = async(TextPlain)=>{
    const hash= await bcrypt.hash(TextPlain, 10)
    return hash
}

const compare = async(password, hashPassword)=>{
    return await bcrypt.compare(password,hashPassword)
}

module.exports = {
    encrypt,
    compare
}