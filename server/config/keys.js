var fs = require('fs');

module.exports = {
  secret: fs.readFileSync('./server/private.key'),
  pub: fs.readFileSync('./server/public.key')
}
