import React, { useEffect, useState } from 'react';

const LeaveTable = () => {
    const [leaveData, setLeaveData] = useState([]);
    console.log("leaveData:", leaveData);

  useEffect(() => {
    // Fetch the form data from the backend API
    fetch('http://localhost:3000/getleave')
      .then((response) => response.json())
      .then((data) => {
        // Update the state with the fetched data
        setLeaveData(data);
      })
      .catch((error) => {
        // Handle any errors
        console.error(error);
      });
  }, []);

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Leave Type</th>
          <th>From</th>
          <th>To</th>
          <th>Team</th>
          <th>Reporter</th>
        </tr>
      </thead>
      <tbody>
        {leaveData.map((leave) => (
          <tr key={leave.id}>
            <td>{leave.name}</td>
            <td>{leave.leaveType}</td>
            <td>{leave.fromDate}</td>
            <td>{leave.toDate}</td>
            <td>{leave.team}</td>
            <td>{leave.reporter}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default LeaveTable;
