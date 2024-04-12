import mysql from 'mysql2/promise';

/*  PRODUCTION ---
*   Please uncomment everything before pushing to production
*   Used with npm run build and npm start
*/

// let pool: mysql.Pool | null = null;

// export const initializePool = async () => {
//   if (!pool) {
//     // Create the pool if it doesn't exist
//     pool = await mysql.createPool({
//       connectionLimit: 10,
//       host: process.env.DB_HOST,
//       user: process.env.DB_USER,
//       password: process.env.DB_PASS,
//       database: process.env.DB_NAME
//     });

//     console.log("POOL CREATED");
//   }
// };

// export const getPool = (): mysql.Pool => {
//   if (!pool) {
//     throw new Error("Pool has not been initialized");
//   }

//   return pool;
// }


/*  DEVELOPMENT SERVER ---
*   Please delete everything below when pushing to production.
*
*   NOTE: This will cause mysql to throw the error "too many connections".
*         Must completely restart the server to close connections.
*/
let pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export const getPool = () => { return pool }

export const initializePool = async () => {};