import React, { useEffect, useState } from "react";

const MyComponent = () => {

  const [message, setMessage] = useState("Loading");

  const handleFetchData = async () => {
    const response = await fetch(`http://localhost:8000/karaoke`);
    const data = await response.text();
    setMessage(data);
  };

  useEffect(() => {
    handleFetchData();
  }, []);

  return (
    <div>
      {message}
    </div>
  );
};

export default MyComponent;
