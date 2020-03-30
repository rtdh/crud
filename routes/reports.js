var express = require('express');
var app = express.Router();

var Blog = require('../models/blog');


app.get('/mandalnames',function(req, res){
		Mandal.find({}, function(err, mandals){
			if(err){
				console.log(err)
			} else {
				res.render('mandals', {mandals: mandals});
			}
		}).sort({ name: 1 });
})



app.get('/blogsReport', function(req,res){
	
	Blog.find({}, function(err, blogs){
		if(err){
			console.log(err)
		} else {
			console.log(blogs);
			res.render('reports/blogReport', {blogs:blogs});
		}
	})
})


module.exports = app;