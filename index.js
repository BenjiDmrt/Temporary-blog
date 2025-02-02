import express from "express";
import bodyParser from "body-parser";
import multer from "multer";
import fs from "fs";
const app = express();
const port = 3000;

const posts = [];
app.use(express.static("public"));

const upload = multer({dest: 'public/images/temp'})
app.use(bodyParser.urlencoded({ extended: true }))

app.get("/", (req, res) => {
  res.render("index.ejs", {posts:posts});
});

app.get("/about", (req, res) => {
  res.render("about.ejs");
});

app.get("/contact", (req, res) => {
  res.render("contact.ejs");
});

app.get("/new-post", (req, res) => {
  res.render("newpost.ejs");
});

app.post("/post",upload.single('uploadedimg'), (req, res) =>{
  let name = req.body.name;
  let text = req.body.text;
  let files = req.file.filename;

  posts.push({title:name, content:text, imgsrc:files})
  res.redirect("/")
});

app.get("/seemore/:id", (req, res) => {
  const postId = req.params.id;
  const post = posts[postId]; 
  if (post) {
    res.render("seemore.ejs", { post: post });
  } else {
    res.status(404).send("Post not found");
  }
});


app.get("/delete/:id", (req, res) => {
  const postId = req.params.id;
  if (postId >= 0 && postId < posts.length) {
    const filePath = `./public/images/temp/${posts[postId].imgsrc}`;

    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
      } else {
        console.log("Image deleted successfully.");
      }});

    posts.splice(postId, 1); 
  }  res.redirect("/");

})
app.get("/edit/:id", (req, res) => {
  const postId = req.params.id;
  if (postId >= 0 && postId < posts.length) {
    const post = posts[postId]; 
    res.render("editpost.ejs", {post: post, index: postId })
  }
  else{
    res.redirect("/")
  }
})
app.post("/editpost/:id",upload.single('uploadedimg'), (req, res) =>{
  const postId = req.params.id;

  if (!posts[postId]) {
    return res.status(404).send("Post not found");
  }
  let name = req.body.name;
  let text = req.body.text;
  let files = req.file ? req.file.filename : posts[postId].imgsrc;

  posts[postId] = ({title:name, content:text, imgsrc:files})
  res.redirect("/")
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
