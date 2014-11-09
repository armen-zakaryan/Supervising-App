define(function() {

    var Profile = function(obj) {
        this.username = obj.username();
        this.password = obj.password();
        this.gender = obj.gender();
        this.email = obj.email();
        this.photo = obj.photo();
    }

    return Profile;
});