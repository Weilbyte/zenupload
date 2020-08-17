const fs = require('fs');
const IncomingForm = require('formidable').IncomingForm;

async function handleUnwanted(req, res, data) {
    if (req.method !== "POST") {
      res.statusCode = 405
      await res.send(
        JSON.stringify({
          success: false,
          msg: "Unsupported method.",
        })
      )
      return true
    }
  
    if (!req.query["filename"]) {
      res.statusCode = 400
      await res.send(
        JSON.stringify({
          success: false,
          msg: "Missing 'filename' parameter.",
        })
      )
      return true
    }
  
    if (!req.headers["content-type"].includes("multipart/form-data;")) {
      res.statusCode = 400
      await res.send(
        JSON.stringify({
          success: false,
          msg: "Unsupported Content-Type.",
        })
      )
      return true
    }
  
    if (!data.files["image"]) {
      res.statusCode = 400
      await res.send(
        JSON.stringify({
          success: false,
          msg: "Missing 'image' form file.",
        })
      )
      return true
    }
  
    if (!data.files["image"]["type"].startsWith("image/")) {
      res.statusCode = 400
      await res.send(
        JSON.stringify({
          success: false,
          msg: "Uploaded file must be image/* type.",
        })
      )
      return true
    }
  
    return false
};

exports.default = async function (req, res) {
    const data = await new Promise((resolve, reject) => {
        const form = new IncomingForm();
        form.parse(req, (err, fields, files) => {
          if (err) return reject(err)
          resolve({ fields, files })
        })
    });
    const unwated = await handleUnwanted(req, res, data);
    if (unwated) return;

    await fs.readFile(data.files.image.path, async (err, content) => {
        if (err) console.log(err)
       
        res.statusCode = 200
        await res.send(`temp good work lol ${content}`)
    });
};