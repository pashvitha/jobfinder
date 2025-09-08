const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql'); // Import mysql module
const app = express();

// // Sample job data (replace with real database or API data)
// const jobs = [
//   { title: "Marketing Manager", location: "Banjara Hills", type: "Full-time" },
//   { title: "Teacher", location: "Gachibowli", type: "Part-time" },
//   { title: "Software Developer", location: "Madhapur", type: "Full-time" },
//   { title: "Marketing Assistant", location: "Madhapur", type: "Full-time" },
//   { title: "Teacher Assistant", location: "Hyderabad", type: "Full-time" }
// ];

// create my sql connection
const db = mysql.createConnection({
  host: 'localhost', // MySQL server address
  user: 'root',      // Your MySQL username (change this)
  password: '1234567',      // Your MySQL password (change this)
  database: 'jobSearch', // The database you created
});

// Serve static files (frontend HTML, CSS, JS)
app.use(express.static('public'));

// Parse JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// realted to webhook

// Job search endpoint
// app.post('/search-jobs', (req, res) => {
//   const userJobType = req.body.job_type ? req.body.job_type.toLowerCase() : '';
//   const userLocation = req.body.location ? req.body.location.toLowerCase() : '';

//   const filteredJobs = jobs.filter(job => {
//     const jobTypeMatch = userJobType ? job.title.toLowerCase().includes(userJobType) : true;
//     const normalizedLocation = userLocation ? userLocation.replace(/\s+/g, '').toLowerCase() : '';
//     const jobLocationNormalized = job.location.replace(/\s+/g, '').toLowerCase();
//     const locationMatch = normalizedLocation ? jobLocationNormalized.includes(normalizedLocation) : true;
//     return jobTypeMatch && locationMatch;
//   });

// const filteredJobs = jobs.filter(job => {
//     // First, check if the job type matches, allow partial match for job titles
//     const jobTypeMatch = userJobType ? job.title.toLowerCase().includes(userJobType.toLowerCase()) : true;
  
//     // Normalize the location inputs and allow partial matches
//     const normalizedLocation = userLocation ? userLocation.replace(/\s+/g, '').toLowerCase() : '';
//     const jobLocationNormalized = job.location.replace(/\s+/g, '').toLowerCase();
  
//     // If user specified location, check for exact location match
//     const locationMatch = normalizedLocation
//       ? jobLocationNormalized.includes(normalizedLocation) // Partial match for location
//       : true; // Match any location if userLocation is empty
  
//     return jobTypeMatch && locationMatch;
//   });
  
//   // If no jobs match the specific location, show jobs with the same job type from other locations
//   if (filteredJobs.length === 0 && userLocation) {
//     // Show jobs with the same job type, but from other locations
//     const fallbackJobs = jobs.filter(job => {
//       const jobTypeMatch = userJobType ? job.title.toLowerCase().includes(userJobType.toLowerCase()) : true;
//       return jobTypeMatch; // Only match based on job type
//     });
  
//     if (fallbackJobs.length > 0) {
//       filteredJobs.push(...fallbackJobs); // Add fallback jobs to the filtered list
//     }
// }
//   // Fallback if no jobs found
//   let responseText = "";
//   if (filteredJobs.length > 0) {
//     responseText = `Here are the ${userJobType || 'available'} jobs in ${userLocation || 'all locations'}:`;
//     filteredJobs.forEach((job, index) => {
//       responseText += `\n${index + 1}. ${job.title} - ${job.location} (${job.type})`;
//     });
//   } else {
//     responseText = `I couldn’t find any ${userJobType || ''} jobs in ${userLocation || 'your desired location'}. Please try again.`;
//   }

//   res.json({ result: responseText });
// });

//===========================================================================================================================================



// app.post('/search-jobs', (req, res) => {
//     const userJobType = req.body.job_type ? req.body.job_type.toLowerCase() : '';
//     const userLocation = req.body.location ? req.body.location.toLowerCase() : '';
  
//     // Filter jobs based on user input
//     const exactLocationJobs = jobs.filter(job => {
//       const jobTypeMatch = userJobType ? job.title.toLowerCase().includes(userJobType) : true;
//       const locationMatch = userLocation ? job.location.toLowerCase() === userLocation : true;
//       return jobTypeMatch && locationMatch;
//     });
  
//     const otherLocationJobs = jobs.filter(job => {
//       const jobTypeMatch = userJobType ? job.title.toLowerCase().includes(userJobType) : true;
//       const locationMatch = userLocation ? job.location.toLowerCase() !== userLocation : false;
//       return jobTypeMatch && locationMatch;
//     });
  
//     // Prepare the response
//     let responseText = "";
  
//     if (exactLocationJobs.length > 0) {
//       // Jobs found in the specified location
//       responseText = `Here are the ${userJobType || 'available'} jobs in ${userLocation}:`;
//       exactLocationJobs.forEach((job, index) => {
//         responseText += `\n${index + 1}. ${job.title} - ${job.location} (${job.type})`;
//       });
//     } else {
//       // No jobs found in the specified location
//       responseText = `I couldn’t find any ${userJobType || ''} jobs in ${userLocation}.`;
  
//       if (otherLocationJobs.length > 0) {
//         // Show jobs in other locations
//         responseText += ` However, here are some ${userJobType || 'available'} jobs in other locations:`;
//         otherLocationJobs.forEach((job, index) => {
//           responseText += `\n${index + 1}. ${job.title} - ${job.location} (${job.type})`;
//         });
//       } else {
//         // No jobs found at all
//         responseText += ` Unfortunately, I couldn’t find any jobs matching your criteria.`;
//       }
//     }

  
//     // Send the response back
//     res.json({ result: responseText });
//   });

//==================================================================================================================================================
// this code works ,but if jobs are not find in specifed location it does not show same jobs in another location

// app.post('/search-jobs', (req, res) => {
//   const userJobType = req.body.job_type ? req.body.job_type.toLowerCase() : '';
//   const userLocation = req.body.location ? req.body.location.toLowerCase() : '';

//   // Query the database to get job listings
//   const sql = `SELECT * FROM jobs WHERE title LIKE ? AND location LIKE ?`;
//   const jobTypePattern = `%${userJobType}%`;
//   const locationPattern = `%${userLocation}%`;

//   db.query(sql, [jobTypePattern, locationPattern], (err, results) => {
//     if (err) {
//       console.error("Error executing query:", err);
//       return res.status(500).json({ result: "Error fetching jobs from database" });
//     }

//     // If jobs are found, format the response
//     let responseText = "";
//     if (results.length > 0) {
//       responseText = `Here are the ${userJobType || 'available'} jobs in ${userLocation}:`;
//       results.forEach((job, index) => {
//         responseText += `\n${index + 1}. ${job.title} - ${job.location} (${job.type})`;
//       });
//     } else {
//       responseText = `I couldn’t find any ${userJobType || ''} jobs in ${userLocation}.`;
//     }

//     // Send the response back
//     res.json({ result: responseText });
//   });
// });


//===================================================================================================================================

// this code works if specified job is not found , it shows same job in another location i want this only


// app.post('/search-jobs', (req, res) => {
//   const userJobType = req.body.job_type ? req.body.job_type.toLowerCase() : '';
//   const userLocation = req.body.location ? req.body.location.toLowerCase() : '';

//   // Query the database to get jobs matching the user input
//   const sqlExactMatch = `SELECT * FROM jobs WHERE title LIKE ? AND location LIKE ?`;
//   const jobTypePattern = `%${userJobType}%`;
//   const locationPattern = `%${userLocation}%`;

//   db.query(sqlExactMatch, [jobTypePattern, locationPattern], (err, exactResults) => {
//     if (err) {
//       console.error("Error executing query:", err);
//       return res.status(500).json({ result: "Error fetching jobs from database" });
//     }

//     let responseText = "";

//     if (exactResults.length > 0) {
//       // If jobs are found in the specified location
//       responseText = `Here are the ${userJobType || 'available'} jobs in ${userLocation}:`;
//       exactResults.forEach((job, index) => {
//         responseText += `\n${index + 1}. ${job.title} - ${job.location} (${job.type})`;
//       });
//       res.json({ result: responseText });
//     } else {
//       // If no jobs are found in the specified location, search for jobs with the same type in other locations
//       const sqlOtherLocations = `SELECT * FROM jobs WHERE title LIKE ? AND location NOT LIKE ?`;

//       db.query(sqlOtherLocations, [jobTypePattern, locationPattern], (err, otherResults) => {
//         if (err) {
//           console.error("Error executing query:", err);
//           return res.status(500).json({ result: "Error fetching jobs from database" });
//         }

//         if (otherResults.length > 0) {
//           // If jobs are found in other locations
//           responseText = `Sorry, we couldn’t find any ${userJobType || ''} jobs in ${userLocation}. However, here are some ${userJobType || 'available'} jobs in other locations:`;
//           otherResults.forEach((job, index) => {
//             responseText += `\n${index + 1}. ${job.title} - ${job.location} (${job.type})`;
//           });
//         } else {
//           // If no jobs are found at all
//           responseText = `I couldn’t find any ${userJobType || ''} jobs in ${userLocation} or any other locations.`;
//         }

//         res.json({ result: responseText });
//       });
//     }
//   });
// });


//==================================================================================================================================================================
// this code same as above code , but change is i stored the user data which is entered in prompt

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
