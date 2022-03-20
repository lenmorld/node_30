const express = require('express')
const fs = require('fs')
const AWS = require('aws-sdk')

const { uploadFile } = require('./upload')

require('dotenv').config()

const app = express()
const port = 3000

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

app.get('/', (req, res) => {
//   res.send('Hello World!')
    console.log(__dirname)
    res.sendFile(__dirname + '/index.html')
})

app.get('/upload', (req, res) => {
    // FIXME: get from frontend
    const filename = 'laptop.jpg'
    const fileContent = fs.readFileSync(filename)

    // console.log(fileContent)

    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${filename}`,
        Body: fileContent
    }

    s3.upload(params, (err, data) => {
        if (err) {
            // rejects(err)
            res.status(500).json({
                error: true,
                message: `Error: ${err}`
            })
            return
        }

        // resolve(data.Location)
        res.send({
            message: 'Upload succeess',
            imageUrl: data.Location
        })
    })
})

app.post('/upload-image', (req, res) => {
    // console.log(req)
    uploadFile(req, res)
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
