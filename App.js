import React, { useState } from 'react';
import LeaveTable from './LeaveTable';
import './App.css';

const LeaveForm = () => {
  const [name, setName] = useState('');
  const [leaveType, setLeaveType] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [team, setTeam] = useState('');
  const [file, setFile] = useState(null);
  const [reporter, setReporter] = useState('');

  const handleFormSubmit = (e) => {
    e.preventDefault();
    

    

    // Perform form validation
    if (!name || !leaveType || !fromDate || !toDate || !team || !reporter) {
      alert('Please fill in all the required fields.');
      return;
    }
  
    // Create form data to send in the POST request
    const formData = new FormData();
    formData.append('name', name);
    formData.append('leaveType', leaveType);
    formData.append('fromDate', fromDate);
    formData.append('toDate', toDate);
    formData.append('team', team);
    formData.append('reporter', reporter);
  
    if (leaveType === 'Sick Leave' && file) {
      formData.append('file', file);
    }
  
    // Make the POST request to the backend API endpoint
    fetch('http://localhost:3000/postleave', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response from the backend
        console.log(data);
      })
      .catch((error) => {
        // Handle any errors
        console.error(error);
      });


      const confirmation = window.confirm('Leave application submitted successfully. Do you want to view the leave table?');
      if (confirmation) {
        // Open new window or tab with the leave table URL
        window.open('http://localhost:3000/getleave');
      } 

      // Clear form data
      setName('');
      setLeaveType('');
      setFromDate('');
      setToDate('');
      setFile('');
      setTeam('');
      setReporter('');

  };

  return (
    <div className = "container">
      <div className = "box">
        <h1>Leave Form</h1>
        <form onSubmit={handleFormSubmit}>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div>
            <br/>
            <label>
              Leave Type:
              <input
                type="radio"
                name="leaveType"
                value="Casual Leave"
                checked={leaveType === 'Casual Leave'}
                onChange={(e) => setLeaveType(e.target.value)}
                required
              />
              Casual Leave
            </label>

            <label>
              <input
                type="radio"
                name="leaveType"
                value="Earned Leave"
                checked={leaveType === 'Earned Leave'}
                onChange={(e) => setLeaveType(e.target.value)}
                required
              />
              Earned Leave
            </label>

            <label>
              <input
                type="radio"
                name="leaveType"
                value="Sick Leave"
                checked={leaveType === 'Sick Leave'}
                onChange={(e) => setLeaveType(e.target.value)}
                required
              />
              Sick Leave
            </label>
          </div>
          <br/>
          <label htmlFor="fromDate">From:</label>
          <input
            type="date"
            id="fromDate"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            required
          />

          <label htmlFor="toDate">To:</label>
          <input
            type="date"
            id="toDate"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            required
          />

          <div>
           <br/>
            <label>
              Team Names:
              <input
                type="radio"
                name="team"
                value="Team A"
                checked={team === 'Team A'}
                onChange={(e) => setTeam(e.target.value)}
                required
              />
              Team A
            </label>

            <label>
              <input
                type="radio"
                name="team"
                value="Team B"
                checked={team === 'Team B'}
                onChange={(e) => setTeam(e.target.value)}
                required
              />
              Team B
            </label>

            <label>
              <input
                type="radio"
                name="team"
                value="Team C"
                checked={team === 'Team C'}
                onChange={(e) => setTeam(e.target.value)}
                required
              />
              Team C
            </label>
          </div>
          <br/>
          {leaveType === 'Sick Leave' && (
            <div>
              <label htmlFor="file">File Upload (max: 15mb, pdf/png):</label>
              <input
                type="file"
                id="file"
                onChange={(e) => setFile(e.target.files[0])}
                accept=".pdf,.png"
                required
              />
            </div>
          )}
           <br/>
          <label htmlFor="reporter">Reporter:</label>
          <select
            id="reporter"
            value={reporter}
            onChange={(e) => setReporter(e.target.value)}
            required
          >
          <option value="">Select Reporter</option>
            {/* Populate the options dynamically, fetch from the backend in Task 3 */}
            <option value="Manager A">Manager A</option>
            <option value="Manager B">Manager B</option>
            <option value="Manager C">Manager C</option>
          </select>
          <br/>
          <button type="submit" >Submit</button>
        </form>
      </div>
    </div>
  );
};

export default LeaveForm;
