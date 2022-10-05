const client = require("./connection.js");
const express = require("express");
const cors = require("cors");
const app = express();
//const axios = require('axios');
const port = 3300;

const { celebrate, Joi, errors, Segments } = require('celebrate');

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
app.post(
  "/users",
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string().required(),
      lastname: Joi.string().required(),
      firstname: Joi.string().required(),
      phonenumber: Joi.number().required(),
      password: Joi.string().min(4).required()
    })
  }),
  (req, res) => {
    const user = req.body;
    console.log(req.body);
    if (!user.email || !user.password || !user.lastname)
      res.send({ status: 400, message: "Please fill all fields" });

    let insertQuery = `insert into users(email,lastname,firstname,phonenumber,password) 
values('${user.email}', '${user.lastname}', '${user.firstname}', '${user.phonenumber}', '${user.password}')`;
    client.query(insertQuery, (err) => {
      if (!err) {
        res.send("Insert was successful");
      } //else {
        //console.log(err.message);
        //res.send("there was an error");
      //}
    });
    client.end;
  }
);

app.put("/users/:id", (req, res) => {
  let user = req.body;
  let updateQuery = `update users
                       set lastname = '${user.lastname}',
                       firstname = '${user.firstname}',
                       phonenumber = '${user.phonenumber}',
                       password = '${user.password}',
                       email = '${user.email}'
                       where id = ${req.params.id}`;

  client.query(updateQuery, (err, result) => {
    if (!err) {
      res.send("Update was successful");
    } else {
      console.log(err.message);
      res.send({ status: 400 });

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
      res.send({ status: 400 });
    }
    
  });
  client.end;
});

