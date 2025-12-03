const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static("public")); // allow images to be served

// API route to return the correct image
app.get("/api/getImage", (req, res) => {
    const name = req.query.name.toLowerCase();  //name = jerry

    let image = "default.jpg";

    if (name.includes("tom")) image = "tom.jpg";
    if (name.includes("jerry")) image = "jerry.jpg";
    if (name.includes("dog")) image = "dog.jpg";

    res.json({ url: "/" + image });   
});

// Start server
app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
