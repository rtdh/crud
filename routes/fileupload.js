var express = require('express');
var app = express.Router();

var upload = require('express-fileupload');
const fs = require('fs');
const csv = require('fast-csv');
var Mandal = require('../models/mandal')
var School = require('../models/school')

app.use(upload());

app.get('/fileupload', function(req, res){
	res.render('fileupload');
})

// app.post('/fileupload', function(req, res){
// 	// console.log(req.files)
// 	if (req.files){
		
// 		var file = req.files.file;
// 		var filename = file.name;
		
// 		file.mv('./uploads/' + filename, function(err){
// 			if (err) {
// 				console.log(err);	
// 			} else {
// 				console.log(filename);
// 				}
// 			});
// 				uploadcsv(filename)		
// 		}
// 		req.flash('success', filename + ' file uploaded Successfully!!!')
// 		res.redirect('/fileupload')
// })


//=====================================
	
	app.post('/fileuploadtwo', function(req, res){
		
		var file = req.files.file;
		var file1 = req.files.file1;
		
		var filename = req.files.file.name;
		var filename1 = req.files.file1.name;
		
		file.mv('./uploads/' + filename)
		file1.mv('./uploads/' + filename1)
		
		if (filename === 'mandals.csv') {uploadcsv(filename)} 
		if (filename1 === 'schools.csv') {uploadcsv(filename1)} 
		
		
	
		req.flash('success',  filename + " , " + filename1 + ' files uploaded Successfully!!!')
		res.redirect('/fileupload')
})

//===========================================

function uploadcsv(filename){
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
						if (filename === 'mandals.csv') {
							for (i = 0 ; i < csvData.length; i++){
								var id = csvData[i][0];
								var name = csvData[i][1];
								var csvData2 = {id: id, name: name};
								Mandal.remove({}, function(err){
									if (err){
										console.log(err.message)
									} else {
										console.log('mandal records deleted successfully...')
									}
								})
								Mandal.create(csvData2, function(err, mandal){
									if(err){
										console.log(err)
									} else {
										console.log('mandal names updated successfully...');
									}
								})
							}
						} else {
							for (i = 0 ; i < csvData.length; i++){
								var division = csvData[i][0];
								var mandal = csvData[i][1];
								var mandalcode = csvData[i][2];
								var udisecode = csvData[i][3];
								var schoolname = csvData[i][4];
								var mgmt = csvData[i][5];
								var csvData2 = {division: division, mandal: mandal, mandalcode: mandalcode, udisecode: udisecode, schoolname: schoolname, mgmt: mgmt};
								School.remove({}, function(err){
									if (err){
										console.log(err.message)
									} else {
										console.log('schools records deleted ....')
									}
								})
								School.create(csvData2, function(err, school){
									if(err){
										console.log(err)
									} else {
										console.log('schoolnames updated successfully...');
									}
								})
							}
						}	
						
				});
					stream.pipe(csvStream);
						
}
module.exports = app;