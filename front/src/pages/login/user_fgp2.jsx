import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./css/user_fgp2.css";
import UniID_logo from "../../assets/uniid_logo.png";
import OtpInput from "react-otp-input";

import { useAppUniidContext } from "../../context";
import { requestOtp, verifyOtp } from "../../utils";

export default function UserFGP2() {
  const [otp, setOtp] = useState("");
  const [globalState, dispatch] = useAppUniidContext();
  const [error, setError] = useState({ isError: false, errorMessage: "" });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Resend OTP code
  const resendOtpCode = async (e) => {
    e.preventDefault();

    setLoading(true); // Start showing the loading overlay

    const res2 = await requestOtp({
      action: "reset password",
      receiver: globalState.users.emailAddress,
    });

    setLoading(false); // Stop showing the loading overlay

    if (res2.status === 200) {
      console.log(res2);
      setError({ isError: false });
      setOtp("");
      navigate("/user_checkemail");
    } else {
      setError({
        isError: true,
        errorMessage: "Request OTP failed, server error.",
      });
    }
  };

  // Handle change
  const handleChange = (otp) => {
    setOtp(otp);
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await verifyOtp({
      emailAddress: globalState.users?.emailAddress,
      otpCode: otp,
    });

    if (res?.status === 200) {
      navigate("/user_resetpassword");
    }

    if (res?.status === 400) {
      setError({ isError: true, errorMessage: res.errorMessage + " " });
    }
  };

  // Use effect
  useEffect(() => {
    document.title = "Reset Password";

    if (!window.localStorage.getItem("verification")) {
      navigate("/");
    }

    if (!window.localStorage.getItem("forgotPassword")) {
      navigate("/");
    }
  }, []);
  console.log(globalState.users);
  console.log(otp);
  return (
    <div className="body">
      <div className="left_fgp2wrapper">
        <div className="uniid_logo">
          <img className="logo" src={UniID_logo} alt="UniID Logo" />
        </div>

        <div className="left_fgp2">
          <div className="fgp2_eicon">
            <i className="bx bx-envelope"></i>
          </div>

          <div className="header_fgp2">
            <span className="u_fgp2_header">Check your email</span>
            <span className="u_fgp2_cap">
              We’ve already sent an instruction to recover your <br />
              UniID account to your email
            </span>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="u_fgp2_det">
              <OtpInput
                value={otp}
                onChange={handleChange}
                inputStyle={`${"u_fp2_code"}`}
                numInputs={6}
                separator={<span>-</span>}
                renderInput={(props) => <input {...props} />}
              />
              {/* Continue Button */}
              <input type="submit" value="Continue" className="fgp2_continue" />
              <div
                className="fgp2-cred-error"
                id="error-message"
                style={{ display: `${error.isError ? "block" : "none"}` }}
              >
                <span>{error.errorMessage}</span>
              </div>
              <span className="DNE">
                Did not receive any email yet?
                <a onClick={resendOtpCode} className="click_dne">
                  Resend Code
                </a>
              </span>
            </div>
            {loading && (
              <div className="loading-overlay">
                <span className="loading-container">
                  <span className="loading-icon-animation"></span>
                </span>
                <span className="loading-text">Sending mail...</span>
              </div>
            )}

            <div className="fgp2_backbutton">
              <Link to="/" className="fgp2_bck">
                <span className="back-btn">
                  <i className="bx bx-left-arrow-alt"></i>
                  <span className="back-txt">Back</span>
                </span>
              </Link>
            </div>
          </form>
        </div>
      </div>
      {/* Right Bacgkgaround  */}
      <div className="right_img"></div>
    </div>
  );
}
