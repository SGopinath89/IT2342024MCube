import React, { useState } from 'react';
import Navbar from './Components/Navbar/Navbar';
import Admin from './Pages/Admin/Admin';
import Login from './Pages/Login/Login'; // Import the Login component

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status

  // Function to handle login success
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  return (
    <div>
      <Navbar />
      {/* Conditionally render the Login or Admin component based on login status */}
      {isLoggedIn ? <Admin /> : <Login onLoginSuccess={handleLoginSuccess} />}
    </div>
  );
};

export default App;
