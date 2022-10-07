const client = require("./connection.js");
const express = require("express");
const cors = require("cors");
const app = express();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
//const config = require('../config');
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
        res.send({status: 200, message: "Insert was successful"});
      }
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
      res.send({status: 200, message: "successfully upated"});
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
      res.send({status: 200, message: "successful delete"});
    } 
  });
  client.end;
});

//creating token/hashing password

app.post("/users", async (req, res) => {

  // Our register logic starts here
  try {
    // Get user input
    const { first_name, last_name, email, password } = req.body;

    // Validate user input
    if (!(email && lastname && firstname && phonenumber &&  password )) {
      res.status(400).send("All input is required");
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(400).send("User Already Exist ");
    }

    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = await User.create({
      firstname,
      lastname,
      phonenumber,
      password: password.atleast8chsaracters(), 
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
    });

    // Create token
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "30 min",
      }
    );
    // save user token
    user.token = token;

    // return new user
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
  }
});