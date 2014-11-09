define(['jquery','ko', 'rest_api'], function ($,ko, rest_api) {


	var session = {
		username : ko.observable(),
		password : ko.observable(), 
		option   : ko.observable(''),
		as       : ko.observable('Login')
	}
	function initilize(){
		session.username('');
		session.password('');
	}
	session.allowLogin = ko.computed(function() {
		if( session.username() && session.password() )
			return true;
		else return false;
	});
	session.authenticate = function(){
		initial.setTrue(); // for hidning the help content for the next starting time
		var result = rest_api.authenticate(session);
		result.fail(function (jqXHR) {
			window.location.hash = '404';
			session.option('');
			initilize();
		});
		result.done(function (jqXHR) {
			session.as(session.option());
			session.onLogin(jqXHR);
			initilize();
		});				
	};

	session.loguot = function(){
		rest_api.loguot();
		session.option('');
		session.as('Login');
		return true;
	}







// for hiding the help content of login at the first time
	var initial = {username:true,password:true};
	initial.setTrue = function(){
		initial.username=true;
		initial.password=true;
	}
	session.usernamehelp = ko.computed(function(){
		session.username();
		if(initial.username){
			initial.username = false;
			return false;
		}
		else return !session.username(); 
	});
	session.passwordhelp = ko.computed(function(){
		session.password();
		if(initial.password){
			initial.password = false;
			return false;
		}
		else return !session.password(); 
	});
// code for hideing end






	return session;
	

});

