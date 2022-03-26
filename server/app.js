require("dotenv").config();
const jwt = require("jsonwebtoken");
const express = require("express");
const fs = require("fs").promises;
const cookieParser = require('cookie-parser')
const algosdk = require('algosdk');
const User = require("./user");

const fromHexString = hexString => new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
const toHexString = bytes => bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');

async function fileExists (path) {  
  try {
    await fs.access(path)
    return true
  } catch {
    return false
  }
}

const app = express();
app.use(express.static('build'));

app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({
  type: "application/x-www-form-urlencoded",
  extended: true
}));

app.use(express.text({
  type: "text/html",
  limit: "10mb",
}));

app.options("/*", async (req, res) => {
  res.header('allow', "GET,HEAD,POST,OPTIONS,CONNECT,PUT,DAV,dav");
  res.header('x-api-access-type', 'file');
  res.header('dav', 'tw5/put');
  res.status(200).send();
});

app.put("/*", async (req, res) => {
  await fs.writeFile(`public${req.path}`, req.body, "utf8");
  res.status(200).send();
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    res.cookie('jwtApp', "token");
    res.redirect(`/${username}`);
  } catch (err) {
    console.log(err);
    res.status(400).json("Invalid Credentials");
  }
});

app.get("/apitest", async (req, res) => {
  const myaccount = algosdk.generateAccount();
  console.log("Account Address = " + myaccount.addr);

  res.json({value: "OK"});
});

app.post("/api/seed", async (req, res) => {
  const challenge = Math.floor(Math.random() * 1000000).toString();
  User.initChallenge(req.body.address, challenge);
  res.status(200).json({challenge})
});

app.post("/api/verify", async (req, res) => {
  const found = User.findChallenge(req.body.address, req.body.challenge);
  if (found) {
    const u8 =  new TextEncoder("utf-8").encode(req.body.challenge);
    const verified = algosdk.verifyBytes(u8, fromHexString(req.body.signature), req.body.address);
    if (verified) {
      User.deleteChallenge(req.body.address, req.body.challenge);

      const iat = Math.floor(Date.now()/1000);
      const token = jwt.sign(
        { 
          address: req.body.address,
          iat: iat
        },
        process.env.TOKEN_KEY
      );

      //res.cookie('jwtApp', token);
      res.status(200).json({
        status: "verified", 
        jwt: token,
        iat: iat
      });
    }
    else res.status(200).json({status: "invalid"});
  }
  else res.status(200).json({status: "invalid"});
});

app.post("/wiki/*", async (req, res) => {
  //const token = req.cookies.jwtApp;
  const token = req.body.jwt;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.TOKEN_KEY);
      if ( (decoded.iat + 2*60*60)*1000 > Date.now() ){  //less than 2 hours ago
        const address = decoded.address;
        const address2 = req.path.replace('/wiki/', '')
        if (address == address2) {
          const filename = `data/${address}.html`;
          if (!(await fileExists(filename))){
            await fs.copyFile('empty.html', filename);
          }
          res.sendFile(filename, {root: '.'});  
          return;
        }
      }
    } 
    catch (err) {
      res.redirect('/');
      return;
    }
  }
  res.redirect('/');
})

app.get("/*", async (req, res) => {
  console.log(req.path);
  const token = req.cookies.jwtApp;

  if (!token) {
    return res.redirect('/');
  }
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);

    const a = (decoded.iat + 2*60*60)*1000;
    const b = (new Date()).getTime();

    if ( (decoded.iat + 2*60*60)*1000 < (new Date()).getTime()){  //less than 2 hours ago
      res.redirect('/');
    }

    const username = decoded.username;
    const filename = `data/${username}.html`;

    if (!(await fileExists(filename))){
      await fs.copyFile('empty.html', filename);
    }

    res.sendFile(filename, {root: '.'});
  } catch (err) {
    return res.redirect('/');
  }
});

module.exports = app;