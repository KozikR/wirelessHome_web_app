var LocalStrategy   = require('passport-local').Strategy;

module.exports = function(passport) {
  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(user, done) {
    done(null, user);
  });
  passport.use('local-login', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true 
  },
  function(req, email, password, done) { 
    User.findOne({where: {email: email}, include: [{ model: Role }]}).then(function(user) {
      if (!user) {
        return done('No user found.', false);
      }
      
      if(!User.validPassword(user, password)) {
        return done('Oops! Wrong password.', false);
      } else {
        if(user.isActive != 1) {
          return done('Your account is not activated. Please wait for contact from our support.', false);
        } else {
          var userData = {
            userId : user.userId,
            firstname : user.firstname,
            lastname : user.lastname,
            email : user.email,
            roleCode : user.role.dataValues.roleCode,
            roleName : user.role.dataValues.roleName
          };
          return done(null, userData);
        }
      }
    }).error(function(error) {
        return done(error, false);
    });

  }));

};