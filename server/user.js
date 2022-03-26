const db = require('better-sqlite3')('data/user.db', {});

function User(){
}

User.initChallenge = (address, challenge )=>{
  const sql = `insert into challenges (address, challenge) values('${address}', '${challenge}')`
  console.log(sql);
  db.exec(sql);
}

User.findChallenge = (address, challenge )=>{
  const row = db.prepare('SELECT * FROM challenges WHERE address = ? and challenge = ? ').get(address, challenge);
  if (row) return true;
  return false;
}

User.deleteChallenge = (address, challenge )=>{
  const sql = `delete from challenges where address = '${address}' and challenge = '${challenge}'`;
  console.log(sql);
  db.exec(sql);
}

module.exports = User;