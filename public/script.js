document.getElementById('job-search-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const jobType = document.getElementById('job_type').value;
    const location = document.getElementById('location').value;
  
    const response = await fetch('/search-jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ job_type: jobType, location: location }),
    });
  
    const data = await response.json();
    document.getElementById('results').innerText = data.result;
  });
  