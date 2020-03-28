var express = require('express');
var app = express.Router();
var Blog = require('../models/blog');
var middleware = require('../middleware/middleware');

var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'dkblawqru', 
  api_key: '628672329365769', 
  api_secret: 'h2wOcQu1YozmkvtyzsD6cvRfVMU'
});




app.get('/', function(req,res){
	res.redirect('/dashboard');
})

app.get('/dashboard', function(req,res){
	res.render('dashboard');	
})

// Index Route

app.get('/blogs', middleware.isLoggedIn, function(req,res){
	Blog.find({}, function(err, blogs){
		if(err){
			console.log(err)
		} else{
			res.render('index', {blogs : blogs, currentUser: req.user});
		}
	})
	
})

// New Route

app.get('/blogs/new', middleware.isLoggedIn, function(req, res){
	res.render('new')
});
	
// Create Route
	
app.post('/blogs', middleware.isLoggedIn, upload.single('image'), function(req, res){
	
	cloudinary.v2.uploader.upload(req.file.path, function(err, result) {
  // add cloudinary url for the image to the blog object under image property
  req.body.blog.image = result.secure_url;
  req.body.blog.imageId = result.public_id;
	console.log(result, err)	
  // add author to blog
  req.body.blog.author = {
    id: req.user._id,
    username: req.user.username
  }
	  Blog.create(req.body.blog, function(err, blog) {
		if (err) {
		  req.flash('error', err.message);
		  return res.redirect('back');
		}
		
		res.redirect('/blogs');
	  });
	});
});
// SHOW ROUTES

app.get('/blogs/:id', middleware.isLoggedIn, function(req, res){
	Blog.findById(req.params.id, function(err,foundBlog){
		if(err){
			console.log(err)
		} else {
			res.render('show', {blog: foundBlog})
		}
	})
})

// EDIT ROUTES

app.get('/blogs/:id/edit', middleware.isLoggedIn, function(req,res){
	Blog.findById(req.params.id, function(err, foundBlog){
				if(err){
					console.log(err)
				} else {
					res.render('edit',{blog: foundBlog});
				}
		})
	
})

//UPDATE ROUTES

app.put('/blogs/:id', upload.single('image'), function(req, res){
    Blog.findById(req.params.id, async function(err, blog){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            if (req.file) {
              try {
                  await cloudinary.v2.uploader.destroy(blog.imageId);
                  var result = await cloudinary.v2.uploader.upload(req.file.path);
                  blog.imageId = result.public_id;
                  blog.image = result.secure_url;
              } catch(err) {
                  req.flash("error", err.message);
                  return res.redirect("back");
              }
            }
            blog.title = req.body.title;
            blog.body = req.body.body;
            blog.save();
            req.flash("success","Successfully Updated!");
            res.redirect('/blogs');
        }
    });
});

// DELETE ROUTES

app.delete('/blogs/:id', middleware.isLoggedIn, function(req,res){
	Blog.findById(req.params.id, async function(err, blog) {
    if(err) {
      req.flash("error", err.message);
      return res.redirect("back");
    }
    try {
        await cloudinary.v2.uploader.destroy(blog.imageId);
        blog.remove();
        req.flash('success', 'Blog deleted successfully!');
        res.redirect('/blogs');
    } catch(err) {
        if(err) {
          req.flash("error", err.message);
          return res.redirect("back");
        }
    }
  });
})

module.exports = app;
