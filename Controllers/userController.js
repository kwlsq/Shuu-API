const connection = require('../Databases');
const { createJWToken } = require('../Helpers/jwt');
const Crypto = require('crypto');
const transporter = require('../Helpers/nodemailer');

module.exports = {
    login: (req, res) => {
        let { username, password } = req.body
        const hashPassword = Crypto.createHmac('sha256', 'shuu').update(password).digest('hex')
        const sql = `SELECT * FROM users WHERE username = ${connection.escape(username.toLowerCase())} and password = ${connection.escape(hashPassword)}`
        connection.query(sql, (err, results) => {
            if (err) {
                return res.status(500).send(err)
            }
            if (results.length !== 0) {
                let { id, username, email, verified, role_id } = results[0]
                const token = createJWToken({
                    id, username, email, verified, role_id
                })
                res.status(200).send({ ...results[0], token })
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
                return res.status(500).send(err)
            }
            console.log(results)
            res.status(200).send(results)
        })
    },
    register: (req, res) => {
        console.log(req.body)
        req.body.role_id = 3;
        var { username, password, email, role_id } = req.body
        var today = new Date()
        var date = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`
        const hashPassword = Crypto.createHmac('sha256', 'shuu').update(password).digest('hex')
        console.log(date)
        const sql = `INSERT INTO users(username, password, email, createdat, role_id) 
        values (
            ${connection.escape(username.toLowerCase())},
            ${connection.escape(hashPassword)},
            ${connection.escape(email.toLowerCase())},
            ${connection.escape(date)}, 
            ${connection.escape(role_id)
            })`
        connection.query(sql, (err, results) => {
            if (err) {
                return res.status(500).send(err)
            }
            const sql2 = `SELECT * FROM users WHERE username = ${connection.escape(username)} `
            connection.query(sql2, (err, results2) => {
                if (err) {
                    console.log('error2')
                    res.status(500).send(err)
                }
                let verificationLink = `http://localhost:3000/verified?username=${username}&password=${hashPassword}`
                let mailOptions = {
                    from: 'Admin Keren <vincentiusssss@gmail.com>',
                    to: 'vincentiussss@gmail.com',
                    subject: 'Confirmation Email',
                    html: `
                        <h2>Hi, This is a verification mail</h2>
                        <h3>Please click the link below to verify your account</h3>
                        <a href='${verificationLink}'>click this link!</a>
                        `
                }
                transporter.sendMail(mailOptions, (err, results3) => {
                    if (err) {
                        res.status(500).send(err)
                    }
                    res.status(200).send(results3)
                })
            })
            console.log(results)

            res.status(200).send(results)
        })
    },
    emailVerification: (req, res) => {
        console.log(req.body)
        let { username, password } = req.body
        const sql = `SELECT * FROM users WHERE username = ${connection.escape(username)} and password = ${connection.escape(password)}`
        connection.query(sql, (err, results) => {
            if (err) {
                return res.status(500).send(err)
            }
            console.log(results)
            const sql2 = `UPDATE users SET verified = 1 WHERE username = ${connection.escape(username)}`
            connection.query(sql2, (err, results2) => {
                if (err) {
                    res.status(500).send(err)
                }
                console.log(results2)
                res.status(200).send(results2)
            })
        })
    },
    getUsersData: (req, res) => {
        console.log('ini', req.user)
        if (req.user.id === 1 && req.user.role_id === 1) {
            const sql = `SELECT u.id,u.username,u.email,u.verified,u.createdat,r.role from users u join roles r on u.role_id=r.id;`
            connection.query(sql, (err, results) => {
                if (err) {
                    return res.status(500).send(err)
                }
                console.log(results)
                res.status(200).send(results)
            })
        }
    },
    getUserDetail: (req, res) => {
        console.log('masukgetuserdetail')
        const sql = `
        SELECT u.id,ud.id as ud_id,u.username,u.email,u.verified,u.createdat,ud.first_name,ud.last_name,ud.province,ud.city,ud.address_detail,ud.birth_date,ud.gender,ud.profilepic,r.role 
        FROM users u 
        JOIN users_detail ud ON u.users_detail_id=ud.id 
        JOIN roles r ON u.role_id=r.id
        WHERE u.id=${req.user.id};`
        connection.query(sql, (err, results) => {
            if (err) {
                return res.status(500).send(err)
            }

            res.status(200).send(results[0])
        })
    },


}