const{Pool} = require('pg');

//New Pool instance
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
});
// Add a check to confirm the connection works
pool.connect((err,client,release)=>{
    if(err){
        return console.error('Error acquiring client',err.stack);
    }
    console.log("Successfully connected to PostgreSQL database!");
    release();
});

// Export the pool so other files can use it
module.exports= pool;