var r = require('../rethink');

module.exports = {
  findOrCreateByFacebookId: function (user) {
    return r
      .table('users')
      .filter({ facebookId: user.facebookId })
      .run()
      .then(function(res){
        if(res.length === 0) {
          return r
            .table('users')
            .insert(user, { returnChanges: true})
            .then(function(res){
              return res.changes[0].new_val;
            })
        } else {
          return res[0];
        }
      });
  }
}