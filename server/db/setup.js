var Promise = require('bluebird');

var r = require('./rethink');
var args = process.argv.slice(2);

Promise.coroutine(function *() {
  try {
    // Drop existing database if it exists and --drop is in the arg list
    var dbs = yield r.dbList();
    if( args.indexOf('--drop') !== -1 && dbs.indexOf('pokemon') !== -1) {
      yield r.dbDrop('pokemon');
      console.log('Dropped Database: pokemon')
    }

    //create the database
    yield r.dbCreate('pokemon');
    console.log('Created Database: pokemon');

    //Create all the tables
    yield Promise.map(['cards', 'decks', 'games', 'players', 'users'], function(table){
      return r
        .tableCreate(table)
        .run()
        .then(function(res){
          console.log('Created Table:', table)
        })
    });

    //Create Indexes
    function createIndexLog(table, name) {
      return console.log('Created Index:', name, 'on', table);
    }

    r.table('cards').indexCreate('deckId').run().then(createIndexLog('cards', 'deckId'));
    r.table('decks').indexCreate('userId').run().then(createIndexLog('decks', 'userId'));
    r.table('decks').indexCreate('cardId', r.row('cards')('cardId')).run().then(createIndexLog('decks', 'cardId'));
    r.table('games').indexCreate('winner', r.row('results')('winner')).run().then(createIndexLog('games', 'winner'));
    r.table('players').indexCreate('userId').run().then(createIndexLog('players', 'userId'));
    r.table('players').indexCreate('gameId').run().then(createIndexLog('players', 'gameId'));
    r.table('players').indexCreate('deckId').run().then(createIndexLog('players', 'deckId'));

  } catch (err)  {
    console.log(err);
  }
  r.getPoolMaster().drain();
})();
