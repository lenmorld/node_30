const formidable = require('formidable')
const path = require('path')
const fs = require('fs')

const { uploadToS3 } = require('./s3')

const uploadFile = (req, res) => {
    console.log("upload")

    const form = new formidable.IncomingForm({
        uploadDir: path.join(__dirname, "uploads")
    })
    console.log(form)

    form.parse(req, (err, fields, files) => {
        if (err) {
            console.error(err)
            res.send("ERR!")
            return
        }

        console.log("fields: ", fields)
        console.log("files: ", files)

        const origPath = files.image.filepath
        console.log("origPath: ", origPath)

        const newPath = path.join(__dirname, 'uploads', files.image.originalFilename)
        console.log("newPath: ", newPath)

        const fileName = files.image.originalFilename

        const rawData = fs.readFileSync(origPath)

        fs.writeFile(newPath, rawData, async (err) => {
            if (err) {
                console.error(err)
                res.send("error: ", err)
                return
            }

            try {
                const result = await uploadToS3(newPath, fileName)

                if (result.success) {
                    res.json(result)
                    return
                }
            } catch(e) {
                res.status(500).send("Upload error: " + e)

                // DEV: if resolved instead, get error from object
                // if (result.error) {
                //     console.error(result.message)
                //     res.send("error: ", result.message)
                //     return
                // }
            }
        })
    })
}

module.exports = {
    uploadFile
}