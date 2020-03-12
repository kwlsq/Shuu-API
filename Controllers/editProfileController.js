const connection = require('../Databases')
const { uploader } = require('../Helpers/uploader');
const fs = require('fs')



module.exports = {
    addProfilePict: (req, res) => {
        console.log('masuk add profile pic')
        const path = '/profilepic';
        const upload = uploader(path, 'PROFPIC').fields([{ name: 'image' }]);

        upload(req, res, (err) => {
            if (err) {
                return res.status(500).send({ message: 'Upload file failed !', error: err.message });
            }

            const { image } = req.files;
            console.log(image, 'ini image')

            console.log(req.body, 'ini req.body')
            req.body.image = `${path}/${image[0].filename}`
            console.log(req.body.image)
            const sql = `UPDATE users_detail SET profilepic='${req.body.image}' WHERE id='${req.body.ud_id}' `

            connection.query(sql, (err, results) => {
                if (err) {
                    fs.unlinkSync('./public' + path + '/' + image[0].filename)
                    return res.status(500).send({ message: 'Add Post Failed!', err })
                }
                const sql2 = `SELECT u.id,ud.id as ud_id,u.username,u.email,u.verified,u.createdat,ud.first_name,ud.last_name,ud.province,ud.city,ud.address_detail,ud.birth_date,ud.gender,ud.profilepic,r.role 
                FROM users u 
                JOIN users_detail ud ON u.users_detail_id=ud.id 
                JOIN roles r ON u.role_id=r.id
                WHERE u.id=${req.user.id};`

                connection.query(sql2, (err, results2) => {
                    if (err) {
                        console.log('error')
                        return res.status(500).send(err)
                    }
                    // console.log(results2)
                    res.status(200).send(results2[0])

                })

            })
        })
    },
    updateProfile: (req, res) => {
        console.log('masuk')
        console.log(req.body)
        const sql = `UPDATE users_detail SET ? WHERE id='${req.params.id}'`
        connection.query(sql, req.body, (err, results) => {
            if (err) {
                console.log('error')
                return res.status(500).send(err)
            }
            console.log(results)
            console.log(req.params.id)
            const sql2 = `SELECT u.id,ud.id as ud_id,u.username,u.email,u.verified,u.createdat,ud.first_name,ud.last_name,ud.province,ud.city,ud.address_detail,ud.birth_date,ud.gender,ud.profilepic,r.role 
            FROM users u 
            JOIN users_detail ud ON u.users_detail_id=ud.id 
            JOIN roles r ON u.role_id=r.id
            WHERE u.id=${req.user.id};`
            connection.query(sql2, (err, results2) => {
                if (err) {
                    console.log('error')
                    return res.status(500).send(err)
                }
                console.log(results2)
                res.status(200).send(results2[0])
            })
        })
    }
} 