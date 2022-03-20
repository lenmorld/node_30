const fs = require('fs')
const AWS = require('aws-sdk')

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

const uploadToS3 = async (filePath, fileName) => {
    const fileContent = fs.readFileSync(filePath)

    // console.log(fileContent)
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${fileName}`,
        Body: fileContent
    }

    return new Promise((resolve, reject) => {
        s3.upload(params, (err, data) => {
            if (err) {
                // DEV: return here is important if rejecting!
                // another option is to resolve with an error message
                
                return reject(`Error: ${err}`)
                // resolve({
                //     error: true,
                //     message: `Error: ${err}`
                // })
                // return
            }
    
            return resolve({
                success: true,
                message: 'Upload succeess',
                imageUrl: data.Location
            })
        })
    })
}

module.exports = {
    uploadToS3
}
