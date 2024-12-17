import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LinkedInCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // You can fetch the session or user data from your backend
    fetch("http://localhost:3000/api/linkedin/Callback", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          // Store user in context or local storage
          localStorage.setItem("user", JSON.stringify(data.user));
          navigate("/home");
        } else {
          navigate("/");
        }
      });
  }, [navigate]);

  return <div>Authenticating with LinkedIn...</div>;
};

export default LinkedInCallback;
