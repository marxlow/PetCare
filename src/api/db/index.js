import localConfig from './localConfig';
import { Pool } from 'pg';

const pool = new Pool({
  port: localConfig.port,
  password: localConfig.password,
  database: localConfig.database,
  max: localConfig.max,
  host: localConfig.host,
  user: localConfig.user
});


// Function to initialize connection to DB
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