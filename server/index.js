const express = require("express");
const app = express();
const multer  = require('multer')
const cors = require('cors');

// Enable CORS
app.use(cors());

// app.use((req, res, next) => {
//     // Replace 'https://example.com' with the actual allowed origin
//     res.header('Access-Control-Allow-Origin', 'https://example.com');
//     // Other CORS headers for handling various scenarios
//     res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//     res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
//     // Allow credentials to be sent (if needed)
//     res.header('Access-Control-Allow-Credentials', 'true');
    
//     // Continue to the next middleware
//     next();
// });

// setup multer for file upload in specific folder
var storage = multer.diskStorage(
    {
        destination: '../uploadedFiles',
        filename: function (req, file, cb ) {
            cb( null, file.originalname);
        }
    }
);

const upload = multer({ storage: storage } )

app.use(express.json());

// serving front end build files
app.use(express.static(__dirname + "/../../uploadedFiles"));

// route for file upload
app.post("/api/localFileUpload", upload.single('myFile'), (req, res, next) => {
    console.log(req.file.originalname + " file successfully uploaded !!");
    res.sendStatus(200);
});

app.listen(9000, () => console.log("Listening on port 9000"));
