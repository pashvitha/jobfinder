const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql'); // Import mysql module
const app = express();



// create my sql connection
const db = mysql.createConnection({
  host: 'localhost', 
  user: 'root',      
  password: '######',      
  database: 'jobSearch', 
});

// Serve static files (frontend HTML, CSS, JS)
app.use(express.static('public'));

// Parse JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));




  






app.post('/search-jobs', (req, res) => {
  const userJobType = req.body.job_type ? req.body.job_type.toLowerCase() : '';
  const userLocation = req.body.location ? req.body.location.toLowerCase() : '';

  // Query the database to get jobs matching the user input
  const sqlExactMatch = `SELECT * FROM jobs WHERE title LIKE ? AND location LIKE ?`;
  const jobTypePattern = `%${userJobType}%`;
  const locationPattern = `%${userLocation}%`;

  db.query(sqlExactMatch, [jobTypePattern, locationPattern], (err, exactResults) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ result: "Error fetching jobs from database" });
    }

    let responseText = "";

    if (exactResults.length > 0) {
      // If jobs are found in the specified location
      responseText = `Here are the ${userJobType || 'available'} jobs in ${userLocation}:`;
      exactResults.forEach((job, index) => {
        responseText += `\n${index + 1}. ${job.title} - ${job.location} (${job.type})`;
      });
      res.json({ result: responseText });
    } else {
      // If no jobs are found in the specified location, search for jobs with the same type in other locations
      const sqlOtherLocations = `SELECT * FROM jobs WHERE title LIKE ? AND location NOT LIKE ?`;

      db.query(sqlOtherLocations, [jobTypePattern, locationPattern], (err, otherResults) => {
        if (err) {
          console.error("Error executing query:", err);
          return res.status(500).json({ result: "Error fetching jobs from database" });
        }

        if (otherResults.length > 0) {
          // If jobs are found in other locations
          responseText = `Sorry, we couldn’t find any ${userJobType || ''} jobs in ${userLocation}. However, here are some ${userJobType || 'available'} jobs in other locations:`;
          otherResults.forEach((job, index) => {
            responseText += `\n${index + 1}. ${job.title} - ${job.location} (${job.type})`;
          });
        } else {
          // If no jobs are found at all
          responseText = `I couldn’t find any ${userJobType || ''} jobs in ${userLocation} or any other locations.`;
        }

        res.json({ result: responseText });
      });
    }

    // Save user query to user_queries table
    const insertQuery = `INSERT INTO user_queries (job_type, location) VALUES (?, ?)`;
    db.query(insertQuery, [userJobType, userLocation], (err) => {
      if (err) {
        console.error("Error saving user query:", err);
      } else {
        console.log("User query saved successfully.");
      }
    });
  });
});

  
// Start server
const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

