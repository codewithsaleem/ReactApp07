let express = require("express");
let app = express();

let cors = require("cors");

app.use(express.json());
app.use(cors());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD",
    )
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );

    next();
})

var port = process.env.PORT || 2410;
app.listen(port, () => console.log(`Node app listening on port ${port}`));

//Connection to the database:----
let mysql = require("mysql");
let connData = {
    host: "localhost",
    user: "root",
    password: "",
    database: "testDB",
}































//Connection to the supbase with postgres:-----------------------------------------------------------------------------
const { Client } = require("pg");
const client = new Client({
    user: "postgres",
    password: "Saleem@0786",
    database: "postgres",
    port: 5432,
    host: "db.kzusjuxduqlvldremfxg.supabase.co",
    ssl: { rejectUnauthorized: false },
});
client.connect(function (res, err) {
    console.log(`Connect!!!`);
});

app.get("/svr/employee", function (req, res, next) {
    console.log("Inside /employee get api : ");
    let department = req.query.department;
    let designation = req.query.designation;
    let gender = req.query.gender;

    let conditions = [];
    if (department) {
        conditions.push(`department = '${department}'`);
    }
    if (designation) {
        conditions.push(`designation = '${designation}'`);
    }
    if (gender) {
        conditions.push(`gender = '${gender}'`);
    }

    let whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const query = `SELECT * FROM employee ${whereClause}`;

    client.query(query, function (err, result) {
        if (err) { res.status(400).send(err); }
        res.send(result.rows);
        client.end();
    });
});

app.get("/svr/employee/:empcode", function (req, res, next) {
    let empcode = +req.params.empcode;
    let body = req.body;
    let Connection = mysql.createConnection(connData);

    const query = `SELECT * FROM employee ${empcode}`;

    client.query(query, function (err, result) {
        if (err) { res.status(400).send(err); }
        res.send(result.rows);
        client.end();
    });
});

app.post("/svr/employee", function (req, res, next) {
    let body = req.body;
    let query = "INSERT INTO employee (empcode, name, department, designation, salary, gender) VALUES (?,?,?,?,?,?)";
    let values = [body.empcode, body.name, body.department, body.designation, body.salary, body.gender];

    client.query(query, values, function (err, result) {
        if (err) {
            res.status(400).send(err);
        }
        //console.log(result);
        res.send(`${result.rows} insertion successful`);
    });
});

app.delete("/svr/employee/:empcode", function (req, res) {
    let empcode = +req.params.empcode;

    let Connection = mysql.createConnection(connData);
    let query = "DELETE FROM employee WHERE empcode=?";

    client.query(query, empcode, function (err, result) {
        if (err) {
            res.status(400).send(err);
        }
        //console.log(result);
        res.send(`${result.rows} insertion successful`);
    });
});

app.put("/svr/employee/:empcode", function (req, res, next) {
    let empcode = +req.params.empcode;
    let body = req.body;
    let Connection = mysql.createConnection(connData);
    let query = "UPDATE employee SET name=?, department=?, designation=?, salary=?, gender=? WHERE empcode=?";
    let values = [body.name, body.department, body.designation, body.salary, body.gender, empcode];

    client.query(query, values, function (err, result) {
        if (err) {
            res.status(400).send(err);
        }
        res.send(`${result.rows} updated successful`);
    });
});

//:--------------------------------------------------------------------------------------------------------------------------







































// app.get("/svr/employee", function (req, res) {
//     let department = req.query.department;
//     let designation = req.query.designation;
//     let gender = req.query.gender;

//     let Connection = mysql.createConnection(connData);

//     let conditions = [];
//     if (department) {
//         conditions.push(`department = '${department}'`);
//     }
//     if (designation) {
//         conditions.push(`designation = '${designation}'`);
//     }
//     if (gender) {
//         conditions.push(`gender = '${gender}'`);
//     }

//     let whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

//     let sql = `SELECT * FROM employee ${whereClause}`;

//     Connection.query(sql, function (err, result) {
//         if (err) res.status(404).send(err);
//         else res.send(result);
//     });
// });


// app.get("/svr/employee/:empcode", function (req, res) {
//     let empcode = +req.params.empcode;
//     let body = req.body;
//     let Connection = mysql.createConnection(connData);
//     let sql = "SELECT * FROM employee WHERE empcode=?";

//     Connection.query(sql, empcode, function (err, result) {
//         if (err) res.status(404).send(err);
//         else res.send(result);
//     })
// })

// app.put("/svr/employee/:empcode", function (req, res) {
//     let empcode = +req.params.empcode;
//     let body = req.body;
//     let Connection = mysql.createConnection(connData);
//     let sql = "UPDATE employee SET name=?, department=?, designation=?, salary=?, gender=? WHERE empcode=?";
//     let values = [body.name, body.department, body.designation, body.salary, body.gender, empcode];

//     Connection.query(sql, values, function (err, result) {
//         if (err) res.status(404).send(err);
//         else res.send(result);
//     })
// })

// app.post("/svr/employee", function (req, res) {
//     let body = req.body;
//     let connection = mysql.createConnection(connData);
//     let sql = "INSERT INTO employee (empcode, name, department, designation, salary, gender) VALUES (?,?,?,?,?,?)";
//     let values = [body.empcode, body.name, body.department, body.designation, body.salary, body.gender];

//     connection.query(sql, values, function (err, content) {
//         if (err) res.status(404).send(err);
//         else {
//             res.send(content);
//         }
//     })
// })

// app.delete("/svr/employee/:empcode", function (req, res) {
//     let empcode = +req.params.empcode;

//     let Connection = mysql.createConnection(connData);
//     let sql = "DELETE FROM employee WHERE empcode=?";

//     Connection.query(sql, empcode, function (err, result) {
//         if (err) res.status(404).send(err);
//         else res.send(result);
//     })
// })