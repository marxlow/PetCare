// Entry for backend
const config = require('./config.js');
console.log(JSON.stringify(config));

let pg = require('pg');

let pool = new pg.Pool({
    port: config.port,
    password: config.password,
    database: config.database,
    max: config.max,
    host: config.host,
    user: config.user
});

pool.connect((err, db, done) => {
    if(err) {
        return console.log(err)
    } else {
        db.query('SELECT * from users', (err, table) => {
            if(err) {
                return console.log(err)
            } else {
                console.log(table.rows)
            }
        })
    }
})
