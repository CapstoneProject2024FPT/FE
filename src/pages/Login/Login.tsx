import React, { useState } from "react";
// import "./Login.scss";
import "./SignIn.scss"
import SignInForm from "./SignIn";
import SignUpForm from "./SignUp";

const Login: React.FC = () => {
  const [type, setType] = useState("signIn");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleOnClick = (text: any) => {
    if (text !== type) {
      setType(text);
      return;
    }
  };
  const containerClass =
    "container " + (type === "signUp" ? "right-panel-active" : "");
  return (
    <div className="App">
    <div className={containerClass} id="container">
      <SignUpForm />
      <SignInForm />
      <div className="overlay-container">
        <div className="overlay">
          <div className="overlay-panel overlay-left">
            <h1>Welcome Back!</h1>
            <p>
              To keep connected with us please login with your personal info
            </p>
            <button
              className="ghost"
              id="signIn"
              onClick={() => handleOnClick("signIn")}
            >
              Sign In
            </button>
          </div>
          <div className="overlay-panel overlay-right">
            <h1>Hello, Friend!</h1>
            <p>Enter your personal details and start journey with us</p>
            <button
              className="ghost "
              id="signUp"
              onClick={() => handleOnClick("signUp")}
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default Login;
