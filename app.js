var express = require("express"),
app = express(),
mongoose = require("mongoose"),
bodyParser = require("body-parser");
methodOverride = require("method-override"),
expressSanitizer = require("express-sanitizer");


mongoose.connect("mongodb://localhost/blog");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

// Mongoose/Model Config
var blogSchema = new mongoose.Schema({
    title: String,
    writer: String,
    artist: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

var Blogs = mongoose.model("Blog", blogSchema);

// LANDING
app.get("/", function(req, res){
    res.render("landing");
});

// RESTful Routes

// INDEX
app.get("/blogs", function(req, res){
    Blogs.find({}, function(err, allBlogs){
        if(err){
            console.log(err);
        } else{
            res.render("index", {blogs: allBlogs});
        }
    });
});

// NEW
app.get("/blogs/new", function(req, res){
    res.render("newform");
});

// CREATE
app.post("/blogs", function(req, res){
    req.body.blog.body = expressSanitizer(req.body.blog.body)
    Blogs.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render("newform");
        } else{
            res.redirect("/blogs");
        }
    });
});

// SHOW
app.get("/blogs/:id", function(req, res){
    Blogs.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.render("index");
        } else{
            res.render("show", {blog: foundBlog});
        }
    });
});

// EDIT
app.get("/blogs/:id/edit", function(req, res){
    Blogs.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else{
            res.render("edit", {blog: foundBlog});
        }
    });
});


// UPDATE
app.put("/blogs/:id", function(req, res){
    req.body.blog.body = expressSanitizer(req.body.blog.body)
    Blogs.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updateBlog){
        if(err){
            res.redirect("/blogs");
        } else{
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

// DESTROY
app.delete("/blogs/:id", function(req, res){
    Blogs.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
        } else{
            res.redirect("/blogs");
        }
    });
});





// Port Listener
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Blog App Server Is Listening");
});