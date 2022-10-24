const client = require("./connection.js");
const express = require("express");
const cors = require("cors");
const app = express();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { validateToken } = require("./authmiddleware");
require("dotenv").config();
const port = 3300;

app.use(cors());
app.use(express.json());

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

app.get("/users/:data", (req, res) => {
  client.query(
    `Select * from users where id=${req.params.data} or phonenumber=${req.params.data}`,
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

// registering a user

app.post("/register", async (req, res) => {
  const user = req.body;

  if (!user.email || !user.lastname || !user.password)
    return res.send({ status: 400, message: "Please fill all fields" });

  if (user.password.length < 6)
    return res.send({
      status: 400,
      message: "Password should be atleast 6 characters",
    });
  try {
    const data = await client.query(`SELECT * FROM users WHERE email= $1;`, [
      user.email,
    ]); //Checking if user already exists
    const arr = data.rows;
    if (arr.length != 0) {
      return res.status(400).json({
        error: "Email already exists.",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({
      error: "Database error while registring user!", //Database connection error
    });
  }
  user.password = bcrypt.hashSync(user.password, 6);
  let insertQuery = `insert into users(email,lastname,firstname,phonenumber,password)
    values('${user.email}', '${user.lastname}', '${user.firstname}', '${user.phonenumber}', '${user.password}')`;
  client.query(insertQuery, (err) => {
    if (!err) {
      res.send({ status: 200, message: "registered!", data: user });
    }
  });
});

// login user
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const data = await client.query(`SELECT * FROM users WHERE email= $1;`, [
      email,
    ]); //Verifying if the user exists in the database
    const user = data.rows;
    if (user.length === 0) {
      res.status(400).json({
        error: "User is not registered, Sign Up first",
      });
    } else {
      bcrypt.compare(password, user[0].password, (err, result) => {
        //Comparing the hashed password
        console.log(result);
        if (err) {
          res.status(500).json({
            error: "Server error",
          });
        } else {
          //Declaring the errors
          if (result != true)
            res.status(400).json({
              error: "Enter correct password!",
            });
          else {
            const accessToken = jwt.sign(
              {
                email: email,
                lastname: data.rows[0].lastname,
              },
              // {
              // expiresIn: "30min"
              // },
              process.env.ACCESS_TOKEN_SECRET
            );
            res.status(200).json({
              message: "User signed in!",
              token: accessToken,
            });
          }
        }
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Database error occurred while signing in!", //Database connection error
    });
  }
});

//deleting a user
app.delete("/users/:id", validateToken, (req, res) => {
  let insertQuery = `delete from users where id=${req.params.id}`;
  client.query(insertQuery, (err) => {
    if (!err) {
      res.send({ status: 200, message: "user deleted" });
    }
  });
  client.end;
});

// editing a user
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
      res.send({ status: 200, message: "successfully updated" });
    } else {
      console.log(err.message);
      res.send({ status: 400 });
    }
  });
  client.end;
});
