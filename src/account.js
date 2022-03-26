import generateName from "./dict";

const KEY = "accounts";
const NUM = 4;

const fromHexString = hexString => new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
const toHexString = bytes => bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');

function Account(){}

Account.signIn = async (account, ) => {
  const res = await fetch('/api/seed', {
    method: 'post',
    headers: new Headers({'content-type': 'application/json'}),
    body: JSON.stringify({
      address: account.addr
    })
  });
  const result = await res.json();

  const u8 =  new TextEncoder("utf-8").encode(result.challenge);
  //const str = new TextDecoder("utf-8").decode(u8);

  const sig = window.algosdk.signBytes(u8, account.sk);
  const res2 = await fetch('/api/verify', {
    method: 'post',
    headers: new Headers({'content-type': 'application/json'}),
    body: JSON.stringify({
      address: account.addr,
      challenge: result.challenge,
      signature: toHexString(sig)
    })
  });
  const result2 = await res2.json();
  if (result2.status == "verified"){
    return result2;
  }
  return null;
}

Account.generateAccount = () => {
  const act = window.algosdk.generateAccount();
  act.mnemonic = window.algosdk.secretKeyToMnemonic(act.sk);
  act.name = generateName();
  
  return act;
}

const blankAccount = {
  name: "available",
  addr: null
};

Account.blankAccount = () => {
  return blankAccount;  
}

Account.initAccounts = () => {
  const accounts = [];
  for (let i=0; i<NUM; i++) accounts.push(blankAccount);
  return accounts;
}

Account.loadAccounts = () => {
  let accounts = localStorage.getItem(KEY);
  if (accounts) {
    accounts = JSON.parse(accounts);
    accounts = accounts.map((act)=>{
      if (act.sk) act.sk = fromHexString(act.sk); //in mem uint8array, hex string in localstorage
      return act;
    });
    return accounts;
  }
  return null;
}

Account.saveAccounts = (accounts) => {
  const accounts2 = accounts.map((act)=>{
    let act2 = JSON.parse(JSON.stringify(act));
    if (act2.sk) act2.sk = toHexString(act.sk);
    return act2;
  });
  localStorage.setItem(KEY, JSON.stringify(accounts2));
}

Account.clearAccounts = (account) => {
  let accounts = Account.loadAccounts();
  accounts = accounts.map((act)=>{
    if (account && account.addr){
      if (act.addr == account.addr) return blankAccount;
      else return act;
    }
    else return blankAccount;
  });
  return Account.saveAccounts(accounts);
}

export default Account;