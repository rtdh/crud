var express = require('express');
var app = express.Router();

var upload = require('express-fileupload');
const fs = require('fs');
const csv = require('fast-csv');
var Mandal = require('../models/mandal')

app.use(upload());

app.get('/fileupload', function(req, res){
	res.render('fileupload');
})

app.post('/fileupload', function(req, res){
	// console.log(req.files)
	if (req.files){
		var file = req.files.file;
		var filename = file.name;
		
		file.mv('./uploads/' + filename, function(err){
			if (err) {
				console.log(err);	
			} else {
				console.log(filename);
				}
			});
				let stream = fs.createReadStream('./uploads/' + filename);
				let csvData = [];
				let csvStream = csv
					.parse()
					.on("data", function (data) {
						csvData.push(data)
					})
					.on("end", function () {
						// Remove Header ROW
						csvData.shift();
						
						for (i = 0 ; i < csvData.length; i++){
							var id = csvData[i][0];
							var name = csvData[i][1];
							var csvData2 = {id: id, name: name};
							
							Mandal.create(csvData2, function(err, mandal){
								if(err){
									console.log(err)
								} else {
									// console.log(mandal);
								}
							})
						}
						
				});
					stream.pipe(csvStream);
						
			}
		req.flash('success', filename + ' file uploaded Successfully!!!')
		res.redirect('/fileupload')
})

module.exports = app;
