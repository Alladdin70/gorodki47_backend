
const express = require("express");
const jsonParser = express.json();
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
app.get("/test", function (request,response) {
    response.send("Ok 4603917");
});

app.get("/tables", function (request,response){
    connection.query("select * from tables where status=0;")
        .then(([rows,fields])=>{
            let list = [];
            rows.forEach((row)=>{
                list.push(row.name);
            })
            response.json(list);
        })
});

app.get("/tables2", function (request,response){
    connection.query("select * from tables where status=1;")
        .then(([rows,fields])=>{
            let list = [];
            rows.forEach((row)=>{
                list.push(row.name);
            })
            response.json(list);
        })
});

app.get("/tables3", function (request,response){
    connection.query("select * from tables where status=2;")
        .then(([rows,fields])=>{
            let list = [];
            rows.forEach((row)=>{
                list.push(row.name);
            })
            response.json(list);
        })
});

app.get("/gettable", function (request,response){
    let name = request.query.name;
    connection.query("select * from " + name +";")
        .then(([rows,fields])=>{
            let list = [];
            rows.forEach((row)=>{
                list.push({name: row.name, title: row.title, reg: row.reg});
            })
            response.json(list);
        })
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
app.post("/savetable", jsonParser, function (request,response) {
    let tname = request.query.name;
    connection.query("DROP TABLE " + tname + ";")
        .then(() => {
            connection.query("CREATE TABLE " + tname + " (" +
                "name TEXT," +
                "title TEXT," +
                "reg TEXT" +
                ") ENGINE = InnoDB;")
                .then(() => {
                    request.body.forEach((item) => {
                        let data = [item.name, item.title, item.reg];
                        connection.query("INSERT INTO " + tname + " (name,title,reg) VALUES(?, ?, ?);", data)
                            //.catch(()=>{response.send("The database writing error!");});
                    });
                    response.send("Ok");
                }).catch(() => {response.send("Database error! Unable to open " + tname);});
        }).catch(() => {response.send("Database error! Unable to drop " + tname);});
});
app.listen(3001);