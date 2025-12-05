const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();

// Serve static files from 'public'
app.use(express.json())
app.use(express.static("public"));

// Ensure 'public/Image' exists
const imageDir = path.join(__dirname, "public", "Image");
if (!fs.existsSync(imageDir)) fs.mkdirSync(imageDir, { recursive: true });

// Multer setup for temporary uploads
const storage = multer.diskStorage({ 
    destination: "./public",
    filename: (req, file, cb) => {
        cb(null, `${req.query.name}.jpg`);
    }
});

const upload = multer({storage});

// GET image by name
app.get("/api/getImage", (req, res) => {
    const name = (req.query.name || "").toLowerCase();
    let found = "default.jpg"; // fallback

    

    // look for a file in public/Image containing the query text
    const files = fs.readdirSync(imageDir);

    const filepath = path.join(__dirname,'public',`${name}.jpg`);

    console.log(filepath);

    if(fs.existsSync(filepath))
        res.json({url: `${name}.jpg`})
    else  
        res.json({url: `default.jpg`})
});

// POST upload route
app.post("/api/upload", upload.single("image"), (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const names = req.query.name;
    console.log(names)

    // Use original filename + timestamp to avoid overwriting
    const ext = path.extname(req.file.originalname);
    const fileName = Date.now() + ext;
    const newPath = path.join(imageDir, fileName);

    res.json({message: 'successfully loaded'})
});

app.listen(3000, () => console.log("Server running at http://localhost:3000"));
