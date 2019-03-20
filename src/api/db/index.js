// Entry for backend
import config from './configExample';
import { Pool } from 'pg';

const pool = new Pool({
  port: config.port,
  password: config.password,
  database: config.database,
  max: config.max,
  host: config.host,
  user: config.user
});

// Connect to DB
const connectToDb = (() => {
  console.log('> Trying to connect to DB');
  pool.connect((err, db, done) => {
    if (err) {
      return console.log(err)
    } else {
      console.log('> Connected to DB');
      db.query('SELECT * from users', (err, table) => {
        if (err) {
          return console.log(err)
        } else {
          console.log(table.rows)
        }
      })
    }
  })
});

export {
  connectToDb,
}