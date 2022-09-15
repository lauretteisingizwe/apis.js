const client = require("./connection.js");
const express = require("express");
const cors = require("cors");
const app = express();
const axios = require('axios');


const port = 4000;

app.use(cors());

app.listen(port, () => {
  console.log("Sever is now listening at port " + port);
});
client.connect();

app.get("/users", (req, res) => {
  client.query(`Select * from users`, (err, result) => {
    if (!err) {
      res.send(result.rows);
    }
  });
  client.end;
});

app.get("/users/:id", (req, res) => {
  client.query(
    `Select * from users where id=${req.params.id}`,
    (err, result) => {
      if (!err) {
        res.send(result.rows);
      }
    }
  );
  client.end;
});

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.post("/users", (req, res) => {
  const user = req.body;
  console.log(req.body);
  let insertQuery = `INSERT INTO users(email,lastame,firstName,phoneNumber,password) 
VALUES("hdhdh@gmail.com", "jdhdhd", "dddhdhd", "dddd", "ddddd")`;
  client.query(insertQuery, (err) => {
    if (!err) {
      res.send("Insertion was successful");
    } else {
      console.log(err.message);
    }
  });
  client.end;
});

app.put("/users/:id", (req, res) => {
  let user = req.body;
  let updateQuery = `update users
                         set lastName = '${user.lastName}',
                         firstName = '${user.firstName}',
                         phoneNumber = '${user.phoneNumber}',
                         password = '${user.password}',
                         email = '${user.email}',
                         where id = '${user.id}`;

  client.query(updateQuery, (err, result) => {
    if (!err) {
      res.send("Update was successful");
    } else {
      console.log(err.message);
    }
  });
  client.end;
});

app.delete("/users/:id", (req, res) => {
  let insertQuery = `delete from users where id=${req.params.id}`;
  client.query(insertQuery, (err) => {
    if (!err) {
      res.send("Deletion was successful");
    } else {
      console.log(err.message);
    }
  });
  client.end;
});
//calling Apis
//Axios.get("http://localhost:3000/users")
//.then((res) => console.log(res))
// .catch((err) => console.error(err));

//Axios.post("http://localhost:3000/users", {
//id: "7",
//email: "rtrt@gmail.com",
//firstName: "jkjkj",
//lastName: "hjhjh",
//password: "1234",
//})
//.then((res) => showoutput(res))
// .catch((err) => console.error(err));
