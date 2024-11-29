import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./css/user_fgp3.css";
import UniID_logo from "../../assets/uniid_logo.png";
import {
  calculatePasswordStrength,
  handlePasswordChange,
  handleConfirmPasswordChange,
} from "./js/u_password_utils";

import { useAppUniidContext } from "../../context";

import { resetPassword } from "../../utils";

export default function UserFGP3() {
  const [globalState, dispatch] = useAppUniidContext();
  const [error, setError] = useState({ isError: false, errorMessage: "" });

  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await resetPassword({
      emailAddress: globalState.users?.emailAddress,
      password: confirmPassword,
    });

    if (res.status === 200) {
      console.log(res);

      window.localStorage.removeItem("verification");
      window.localStorage.removeItem("forgotPassword");

      navigate("/");
    }

    if (res.status === 400) {
      setError({ isError: true, errorMessage: res.errorMessage });
    }
  };

  // Use the imported function to calculate password strength
  useEffect(() => {
    calculatePasswordStrength(password);
  }, [password]);

  // Determine if the form submission should be allowed based on password match
  const isFormValid = password && confirmPassword && passwordsMatch;

  // Use effect
  useEffect(() => {
    document.title = "Reset Password";

    if (!window.localStorage.getItem("forgotPassword")) {
      navigate("/");
    }
  }, []);

  // console.log(globalState.users?.emailAddress);
  // console.log(confirmPassword);

  return (
    <div className="body">
      <div className="left_fgp3formwrapper">
        <div className="uniid_logo">
          <img className="logo" src={UniID_logo} alt="UniID Logo" />
        </div>

        <div className="left_fgp3form">
          <div className="header_fgp3form">
            <span className="u_fgp3_header">Set New Password</span>
            <span className="u_fgp3_cap">
              Password must contain at least 8 characters.
            </span>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="u_fgp3_det">
              <div className="user_ff">
                <div className="pass-sec">
                  <div className="form-field-pass">
                    <label>Password</label>
                    <div className="ff-pass-sec">
                      <input
                        className="password-field"
                        type="password"
                        required
                        value={password}
                        onChange={(event) =>
                          handlePasswordChange(
                            password,
                            confirmPassword,
                            setPassword,
                            setPasswordsMatch,
                            event
                          )
                        }
                      />
                      <div className="showBtn">SHOW</div>
                    </div>
                  </div>
                  <div className="indicator">
                    <span className="weak"></span>
                    <span className="medium"></span>
                    <span className="strong"></span>
                  </div>
                </div>
                <div className="form-field">
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(event) =>
                      handleConfirmPasswordChange(
                        password,
                        confirmPassword,
                        setConfirmPassword,
                        setPasswordsMatch,
                        event
                      )
                    }
                  />
                  {!passwordsMatch && confirmPassword && (
                    <div className="password-mismatch">
                      The two passwords that you entered does not match.
                    </div>
                  )}
                </div>
                <div
                  className="fgp3-cred-error"
                  id="error-message"
                  style={{ display: `${error.isError ? "block" : "none"}` }}
                >
                  <span>{error.errorMessage}</span>
                </div>
              </div>
              <div className="fgp3_button">
                <button
                  className="fgp3_btn"
                  type="submit"
                  disabled={!isFormValid}
                >
                  Reset Password
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="right_img"></div>
    </div>
  );
}
