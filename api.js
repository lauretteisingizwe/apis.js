const client = require("./connection.js");
const express = require("express");
const cors = require("cors");
const app = express();
//const axios = require('axios');
const port = 3000;
 

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
  let insertQuery = `insert into users(email,lastname,firstname,phonenumber,password) 
values('${user.email}', '${user.lastname}', '${user.firstname}', '${user.phonenumber}', '${user.password}')`;
  client.query(insertQuery, (err) => {
    if (!err) {
      res.send("Insert was successful");
    } else {
      console.log(err.message.details[0]);
    }
  });
  client.end;
});

app.put("/users/:id", (req, res) => {
  let user = req.body;
  let updateQuery = `update users
                       set lastname = '${user.lastname}',
                       firstname = '${user.firstname}',
                       phonenumber = '${user.phonenumber}',
                       password = '${user.password}',
                       email = '${user.email}'
                       where id = ${user.id}`

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
      res.send("Delete was successful");
    } else {
      console.log(err.message);
    }
  });
  client.end;
});
//calling Apis
//axios.get("http://localhost:5000/users")
//.then((res) => console.log(res))
//.catch((err) => console.error(err, err.response));

//axios.post("http://localhost:3000/users/register", {
//id: "7",
//email: "rtrt@gmail.com",
//firstname: "jkjkj",
//lastNname: "hjhjh",
//phonenumber: "0780988765",
//password: "1234"
//})
//.then((res) => showoutput(res))
 //.catch((err) => console.error(err, err.response));
