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
const send = multer({ 
    dest: "./uploads",
    fileName: (res, file, cb) => {
        cb(null, `${res.query.name}`);
    }
});

const upload = multer({send});

// GET image by name
app.get("/api/getImage", (req, res) => {
    const name = (req.query.name || "").toLowerCase();
    let found = "default.jpg"; // fallback

    // look for a file in public/Image containing the query text
    const files = fs.readdirSync(imageDir);
    for (const file of files) {
        if (file.toLowerCase().includes(name)) {
            found = file;
            break;
        }
    }

    res.sendFile(path.join(imageDir, found));
});

// POST upload route
app.post("/api/upload", upload.single("image"), (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    // Use original filename + timestamp to avoid overwriting
    const ext = path.extname(req.file.originalname);
    const fileName = Date.now() + ext;
    const newPath = path.join(imageDir, fileName);

    fs.rename(req.file.path, newPath, (err) => {
        if (err) return res.status(500).json({ error: "Failed to save file", details: err });
        res.json({ message: "Uploaded successfully", file: "/Image/" + fileName });
    });
});

// Optional: list all images
app.get("/api/listImages", (req, res) => {
    const files = fs.readdirSync(imageDir).filter(f => /\.(jpg|jpeg|png|gif)$/i.test(f));
    res.json({ images: files.map(f => "/Image/" + f) });
});

app.listen(3000, () => console.log("Server running at http://localhost:3000"));
