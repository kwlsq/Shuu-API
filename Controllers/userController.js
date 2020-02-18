const connection = require('../Databases');
const { createJWToken } = require('../Helpers/jwt');
const Crypto = require('crypto');
const transporter = require('../Helpers/nodemailer');

module.exports = {
    login: (req, res) => {
        let { username, password } = req.body
        const hashPassword = Crypto.createHmac('sha256', 'shuu').update(password).digest('hex')
        const sql = `SELECT * FROM users WHERE username = '${username}' and password = '${hashPassword}'`
        connection.query(sql, (err, results) => {
            if (err) {
                res.status(500).send(err)
            }
            if (results.length !== 0) {
                let { id, username, password, email, verified, id_role } = results[0]
                const token = createJWToken({
                    id, username, email, verified, id_role
                })
                res.status(200).send({ id, password, username, email, verified, id_role, token })
            } else {
                res.status(500).send({ message: 'Username or Password Invalid' })
            }

        })
    },
    keepLogin: (req, res) => {
        return res.status(200).send(req.user)
    },
    getByUsername: (req, res) => {
        console.log(req.params.username)
        const sql = `SELECT username FROM users where username = ${connection.escape(req.params.username)}`
        connection.query(sql, (err, results) => {
            if (err) {
                res.status(500).send(err)
            }
            console.log(results)
            res.status(200).send(results)
        })
    },
    register: (req, res) => {
        console.log(req.body)
        var { username, password, email, id_role } = req.body
        const hashPassword = Crypto.createHmac('sha256', 'shuu').update(password).digest('hex')
        console.log(hashPassword)
        const sql = `INSERT INTO users(username, password, email, id_role) values ('${username}','${hashPassword}','${email}','${id_role}')`
        connection.query(sql, (err, results) => {
            if (err) {
                console.log('error1 ')
                res.status(500).send(err)
            }
            const sql2 = `SELECT * FROM users WHERE username = '${username}'`
            connection.query(sql2, (err, results2) => {
                if (err) {
                    console.log('error2')
                    res.status(500).send(err)
                }
                let verificationLink = `http://localhost:3000/verified?username=${username}&password=${hashPassword}`
                let mailOptions = {
                    from: 'Admin <vincentiussss@gmail.com',
                    to: 'vincentiussss@gmail.com',
                    subject: 'Confirmation Email',
                    html: `
                        <h2>Hi, This is a verification mail</h2>
                        <h3>Please click the link below to verified your account</h3>
                        <a href='${verificationLink}'>click this link!</a>
                        `
                }
                transporter.sendMail(mailOptions, (err, results3) => {
                    if (err) {
                        res.status(500).send(err)
                    }
                    console.log('yak pulang')
                    console.log(results3)
                    res.status(200).send(results3)
                })
            })
            console.log(results)

            res.status(200).send(results)
        })
    }


}