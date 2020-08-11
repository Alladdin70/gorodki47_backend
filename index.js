
const express = require("express");
const mysql = require("mysql2");
const app = express();
const host = "localhost";
const user = "db";
const database = "gorodki";
const password = "4603917q";

const connection = mysql.createConnection({
    host: host,
    user: user,
    database: database,
    password: password
}).promise();

app.get("/", function (request,response) {
    response.send("<h3>Local react-backend server</h3>");
});
app.use("/newtable", function (request,response) {
    let tname = request.query.name;
    let exists = 0;
    connection.query("select * from tables")
        .then(([rows,fields]) => {
            rows.forEach((row) => {
                if (row.name === tname) {
                    exists = 1;
                }
            });
            if(exists){
                response.send("Error! The table exists.")
            }
            else{
                connection.query("CREATE TABLE " + tname + " (" +
                    "name TEXT," +
                    "title TEXT," +
                    "reg TEXT" +
                    ") ENGINE = InnoDB;").then(()=>{
                        console.log("written");
                        connection.query("INSERT INTO tables(id, name) VALUES(default, ?);",[tname])
                            .then(() => {
                                response.send("Ok");
                            }).catch( err =>{
                                response.send("Database error " + err);
                        });
                }).catch(err=> {
                    response.send("Database error " + err);
                });
            }
        }).catch(err => {
            response.send("Database error " + err);
    });
});
app.listen(3001);