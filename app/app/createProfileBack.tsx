// Importing the modules
const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

// Create express instance
const app = express(); 

// Parse application/json
app.use(bodyParser.json());
// app.use(express.json()); 

// Create pool
const pool = new Pool({
    user: 'dbuser',
    host: 'database.server.com',
    database: 'mydb',
    password: 'secretpassword',
    port: 3211,
  });

// Insert into table
app.post('/submit-form', (req, res) => {
  const { fullName, country, address, occupationTags, bio } = req.body;

  pool.query(
    'INSERT INTO profile (full_name, country, address, occupation_tags, bio) VALUES ($1, $2, $3, $4, $5)',
    [fullName, country, address, occupationTags, bio],
    (error) => {
      if (error) {
        throw error;
      }
      res.status(200).json({ status: 'success', message: 'Data inserted!' });
    }
  );
});

//  Start server at 3000
app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });

