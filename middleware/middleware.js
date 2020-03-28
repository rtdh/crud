// all middleware goes here

var middlewareObj = {};

middlewareObj.isLoggedIn= function (req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash('error', 'Pls Login first !')
	res.redirect('/login')
}

module.exports = middlewareObj;
