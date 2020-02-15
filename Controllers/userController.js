const connection = require('../Databases')
const { createJWToken } = require('../Helpers/jwt')

module.exports = {
    login: (req, res) => {
        console.log(req.user)
        //untuk login, apakah username dan password yang dicek harus di token dlu?
    },
    register: (req, res) => {
        console.log(req.params.username)
        const sql = `SELECT username FROM users where username = ${connection.escape(req.params.username)}` 
        connection.query(sql, (err,results)=>{
            if(err){
                res.status(500).send(err)
            }
            console.log(results)
            res.status(200).send(results)
        })
    }
    

}