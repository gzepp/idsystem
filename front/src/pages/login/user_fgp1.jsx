import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./css/user_fgp1.css";
import UniID_logo from "../../assets/uniid_logo.png";

import { FORGOT_PASSWORD, useAppUniidContext } from "../../context";
import { requestOtp, checkStudent } from "../../utils";

export default function UserFGP1() {
  const [emailAddress, setEmailAddress] = useState("");
  const [globalState, dispatch] = useAppUniidContext();
  const [error, setError] = useState({ isError: false, errorMessage: "" });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true); // Start showing the loading overlay

    const res = await checkStudent({ emailAddress });

    if (res.status === 200) {
      console.log(res);

      window.localStorage.setItem("verification", true);
      window.localStorage.setItem("forgotPassword", true);

      dispatch({ type: FORGOT_PASSWORD, payload: emailAddress });
      const res2 = await requestOtp({
        action: "reset password",
        receiver: emailAddress,
      });

      setLoading(false); // Stop showing the loading overlay

      if (res2.status === 200) {
        console.log(res2);
        navigate("/user_checkemail");
      } else {
        setError({
          isError: true,
          errorMessage: "Request OTP failed, server error",
        });
      }
    }

    if (res.status === 400) {
      setError({
        isError: true,
        errorMessage: "Request OTP failed, invalid credentials",
      });
      setLoading(false); // Stop showing the loading overlay
    }
  };

  // Use effect
  useEffect(() => {
    document.title = "Reset Password";
  }, []);

  console.log(emailAddress);

  return (
    <div className="body">
      <div className="left_fgp1wrapper">
        <div className="uniid_logo">
          <img className="logo" src={UniID_logo} alt="UniID Logo" />
        </div>

        <div className="left_fgp1">
          <div className="header_fgp1">
            <p className="u_fgp1_header">Forgot Password?</p>
            <p className="u_fgp1_cap">
              Enter the email associated with your account and we’ll send an
              email with instruction to reset your password.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="u_fgp1_det">
              <div className="userfgp1_ff">
                <div className="form-field">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="emailAddress"
                    placeholder="Your email address here"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
            <div
              className="fgp1-cred-error"
              id="error-message"
              style={{ display: `${error.isError ? "block" : "none"}` }}
            >
              <span>{error.errorMessage}</span>
            </div>

            {loading && (
              <div className="loading-overlay">
                <span className="loading-container">
                  <span className="loading-icon-animation"></span>
                </span>
                <span className="loading-text">Sending mail...</span>
              </div>
            )}

            <div className="fgp1_button">
              <button className="fgp1_btn" type="submit">
                Submit
              </button>
            </div>

            <div className="fgp1_backbutton">
              <Link to="/" className="fgp1_bck">
                <i className="bx bx-left-arrow-alt"></i>Back to Log In
              </Link>
            </div>
          </form>
        </div>
      </div>

      <div className="right_img"></div>
    </div>
  );
}
