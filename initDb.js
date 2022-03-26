const crypto = require('crypto');
const db = require('better-sqlite3')('data/user.db', {});

function init(){
  db.exec('drop table if exists challenges');
  db.exec('create table challenges (id integer primary key autoincrement, address text, challenge text, signature text)');
}

init();

const token_key= crypto.randomBytes(64).toString("hex");
console.log(`TOKEN_KEY=${token_key}`);

