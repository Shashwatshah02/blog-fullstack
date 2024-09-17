const express = require("express");
const app = express();
const bodyParser = require("body-parser");
var mysql = require("mysql");
app.use(bodyParser.json());

const port = process.env.port || 5000;

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "blog",
});

con.connect(function(err,){
    if(err) err
    console.log("Connection successfull")
})

app.get("/table", (req, res) => {
  console.log("Message received from backend to frontend");
  con.query("SELECT * FROM blog_table", function (err, result, fields) {
    if (err) throw err;
    console.log(result);
  })
});

app.post("/submit1", (req, res) => {
  var name = req.body.name;
  console.log("Message received from frontend to backend");
});

app.post("/submit", (req, res) => {
    var name = req.body.name;
    console.log("Message received from frontend to backend");
    var sql = "INSERT INTO category_table (Category_name) VALUES ('Cars')";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
  });

  });

app.listen(port, () => {
  console.log("Hola");
});
