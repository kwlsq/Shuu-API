const connection = require('../Databases')
const { uploader } = require('../Helpers/uploader');
const fs = require('fs')



module.exports = {
    addProfilePict: (req, res) => {
        const path = '/profilepic';
        const upload = uploader(path, 'PROFPIC').fields([{ name: 'image' }]);

        upload(req, res, (err) => {
            if (err) {
                return res.status(500).send({ message: 'Upload file failed !', error: err.message });
            }

            const { image } = req.files;
            console.log(image)

            var sql = `INSERT INTO posts SET ? `

            sqlDB.query(sql, data, (err, results) => {
                if (err) {
                    fs.unlinkSync('./public' + path + '/' + image[0].filename)
                    return res.status(500).send({ message: 'Add Post Failed!', err })
                }

                res.status(200).send(results)
            })
        })
    }
}