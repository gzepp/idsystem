import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./css/staff_loginform.css";
import UniID_logo from "../../assets/uniid_logo.png";

//js fuction
import { togglePasswordVisibility } from "./js/s_pvisibility";

import {
  SET_ACTIVE_PAGE,
  USER_ACTION,
  ROUTE_INSERT,
  logInuser,
  useAppUniidContext,
  validateUsers,
  fetchProfile,
} from "../../context";

export default function StaffLogIn() {
  const navigate = useNavigate();
  const [globalState, dispatch] = useAppUniidContext();
  const [showPassword, setShowPassword] = useState(false);
  const [keepMeLoggedIn, setKeepMeLoggedIn] = useState(false);
  const [error, setError] = useState({ isError: false, errorMessage: "" });

  const [formData, setFormData] = useState({
    userName: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(false);
    try {
      const res = await logInuser(dispatch, formData);

      if (res?.status === 200) {
        if (keepMeLoggedIn) {
          window.sessionStorage.setItem("loggedIn", true);
        } else {
          window.sessionStorage.removeItem("loggedIn");
        }

        const _id = res.data._id;
        const idNumber = res.data.idNumber;
        const payload = { _id: _id, idNumber: idNumber };

        console.log(payload);
        const res2 = await fetchProfile(dispatch, payload);

        // Move this part inside the fetchProfile callback
        if (res2?.status === 200) {
          console.log("yey");
          window.sessionStorage.setItem(
            "profileInfo",
            JSON.stringify(res2.data)
          );
        } else {
          console.log("error failed to fetch profile");
          setError({
            isError: true,
            errorMessage: "Failed to fetch profile",
          });
          // Set a timer to reset the error state after 5 seconds
          setTimeout(() => {
            setError(false);
          }, 5000);
          return;
        }

        window.sessionStorage.setItem("profile", JSON.stringify(res.data));

        if (res.data.uType === "admin") {
          navigate("/admin_dashboard");
        } else if (res.data.uType === "staff") {
          navigate("/staff_homepage");
        } else if (res.data.uType === "student") {
          navigate("/user_homepage");
        } else if (res.data.uType === "registrar") {
          navigate("/reg_homepage");
        }
      } else {
        console.log("Login user not found or response missing data:", res);
        setError({
          isError: true,
          errorMessage: "Invalid credentials ",
        });
        setTimeout(() => {
          setError(false);
        }, 5000);
        return;
      }
    } catch (error) {
      console.log("Login failed:", error);
      setError({
        isError: true,
        errorMessage: "Login failed Server Error",
      });
      // Set a timer to reset the error state after 5 seconds
      setTimeout(() => {
        setError(false);
      }, 5000);
      return;
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
    togglePasswordVisibility();
  };

  const validateAndRedirect = async () => {
    const loggedIn = JSON.parse(sessionStorage.getItem("loggedIn"));
    const tokenObject = JSON.parse(sessionStorage.getItem("profile"));

    if (loggedIn && tokenObject) {
      const token = tokenObject._id;
      const authtoken = tokenObject.token;

      try {
        const res = await validateUsers(dispatch, { token });

        if (res?.status === 200) {
          document.cookie = `token=${authtoken}; path=/`;

          if (tokenObject.uType) {
            if (tokenObject.uType === "admin") {
              navigate("/admin_dashboard");
            } else if (tokenObject.uType === "staff") {
              navigate("/staff_homepage");
            } else if (tokenObject.uType === "student") {
              navigate("/user_homepage");
            } else if (res.data.uType === "registrar") {
              navigate("/reg_homepage");
            } else {
              // Handle the case where 'uType' is not recognized
              console.log("Invalid uType:", tokenObject.uType);
            }
          } else {
            // Handle the case where 'uType' is missing
            console.log("Missing uType in tokenObject:", tokenObject);
          }
        }
      } catch (error) {
        console.log("Validation error:", error.response.data);
      }
    } else {
      // Handle the case where 'loggedIn' or 'tokenObject' is missing /clears local storage and cookies
      sessionStorage.clear();
      document.cookie
        .split(";")
        .forEach(
          (c) =>
            (document.cookie = c
              .replace(/^ +/, "")
              .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`))
        );
    }
  };
  //validate and redirect
  useEffect(() => {
    const tokenObject = JSON.parse(sessionStorage.getItem("profile"));
    if (tokenObject) {
      validateAndRedirect();
    }
  }, []);
  return (
    <div className="body">
      <div className="staff_img"></div>

      <div className="left_loginformwrapper">
        <div className="uniid_logo">
          <img className="logo" src={UniID_logo} alt="UniID Logo" />
        </div>

        <div className="left_loginform">
          <div className="header_loginform">
            <p className="s_login_header">Staff Login</p>
            <p className="s_login_cap">
              Please enter your following credentials
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="s_login_det">
              <div className="staff-ff">
                <div className="form-field">
                  <label>Username</label>
                  <input
                    type="text"
                    name="userName"
                    value={formData.userName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-field-s-pass">
                  <label>Password</label>
                  <div className="ff-s-pass">
                    <input
                      className="password-u-field"
                      type={showPassword ? "text" : "password"}
                      required
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    {formData.password !== "" && (
                      <div className="S_showBtn" onClick={handleTogglePassword}>
                        {showPassword ? "HIDE" : "SHOW"}
                      </div>
                    )}
                  </div>
                </div>
                <div
                  className="staff-login-error"
                  id="error-message"
                  style={{ display: `${error.isError ? "block" : "none"}` }}
                >
                  <span>{error.errorMessage}</span>
                </div>
              </div>

              <div className="fgp_container">
                <label className="kms">
                  <input
                    type="checkbox"
                    checked={keepMeLoggedIn}
                    onChange={() => setKeepMeLoggedIn(!keepMeLoggedIn)}
                    className="cb"
                  />
                  <span className="cm"></span>Keep me signed in
                </label>
              </div>

              <div className="login_button">
                <button className="login_btn" type="submit">
                  Log In
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
