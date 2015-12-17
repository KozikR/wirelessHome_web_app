module.exports = {
  isAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('back');
  },
  isNotAuthenticated : function(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }

    res.redirect('back');
  },
  isAdminOrSameUser: function(req, res, next) {
    var id = req.params.id;
    if(req.user.roleCode == 'admin' || id == req.user.userId) {
      return next();
    }
    res.redirect('back');
  },
  isAdmin: function(req, res, next) {
    if(req.user.roleCode == 'admin') {
      return next();
    }
    res.redirect('back');
  },
  isUser: function(req, res, next) {
    if(typeof req.user.roleCode != 'undefined' && req.user.roleCode != 'admin') {
      return next();
    }
    res.redirect('back');
  }
};