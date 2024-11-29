import React, { useEffect, useState } from "react";
import { UserTopbar, UserFooter } from "../../components";
import { Link, useNavigate, useParams } from "react-router-dom";
import { parse, format } from "date-fns";

import "./css/user_annoview.css";
import { validateUsers, useAppUniidContext } from "../../context";

import UserAnnoListSearch from "./data/user_component_sidesearch";

export default function UserAnnouncementView() {
  const navigate = useNavigate();
  const [globalState, dispatch] = useAppUniidContext();
  const [error, setError] = useState(null);
  const [student_userData, setStudent] = useState({});

  //Announcement Data
  const { annoItem } = useParams();
  const decodedAnnoData = JSON.parse(decodeURIComponent(annoItem));

  //validate function user
  const validate = async () => {
    try {
      // Get the token JSON string from sessionStorage
      const tokenString = window.sessionStorage.getItem("profile");
      // console.log(tokenString);

      if (!tokenString) {
        // Handle the absence of data in sessionStorage as needed
        navigate("/");
        return;
      }
      // Parse the JSON string to an object
      const tokenObject = JSON.parse(tokenString);

      // Access the token property
      const token = tokenObject._id;
      const isArchive = tokenObject.isArchive;

      const res = await validateUsers(dispatch, {
        token: token,
        isArchive: isArchive,
      });
      // Check user type
      const userType = res.data?.uType;
      // console.log(userType);

      if (res?.status === 200) {
        if (userType !== "student") {
          navigate("/");
        } else {
          return;
        }
      } else {
        navigate("/");
      }
    } catch (error) {
      navigate("/");
    }
  };

  const getProfile = async () => {
    // Check if user data is present in session storage
    const userData = JSON.parse(sessionStorage.getItem("profileInfo"));
    if (!userData) {
      navigate("/");
      return null;
    } else {
      return userData;
    }
  };

  useEffect(() => {
    // validate();
    getProfile()
      .then((userData) => {
        setStudent(userData); // Store the original data
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div className="user-body-container">
      <div className="user-topbar">
        <UserTopbar userName={student_userData.userFName} />
        <div className="lower-topbar-wrapper">
          <div className="lower-topbar">
            <span className="lower-topbar-text">
              <Link to="/user_homepage" className="top-linking-page">
                <span className="active-linking">Home </span>
              </Link>
              {"/"}
              <Link to="/user_homepage" className="top-linking-page">
                <span className="active-linking">Announcement Section </span>
              </Link>
              {"/"}
              <span className="inactive-link"> {decodedAnnoData.title}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="user-main-contents">
        <div className="user-body-limiter">
          {/* Main Announcement Data */}
          <div className="anno-postview-container-wrapper">
            <div className="annoview-post-main-container">
              <div className="anno-post-contents">
                <div className="anno-picture-container">
                  <div
                    className="anno-main-picture"
                    style={{
                      backgroundImage: `url(https://res.cloudinary.com/debe9q66f/image/upload/${decodedAnnoData.postImage})`,
                    }}
                  ></div>
                </div>
                <div className="annodet-container">
                  <div className="annodetails-container">
                    <span className="anno-main-title-txt">
                      {decodedAnnoData.title}
                    </span>
                    <div className="anno-poster-details">
                      <span className="anno-poster">SHASM Admin</span>
                      <span className="anno-date-pub">
                        {format(
                          parse(
                            decodedAnnoData.dateposted,
                            "yyyy-MM-dd'T'HH:mm:ss.SSSXXX",
                            new Date()
                          ),
                          "MMMM dd, yyyy"
                        )}
                      </span>
                    </div>
                    <div className="anno-post-det-main-container">
                      <span className="anno-post-det">
                        {decodedAnnoData.description}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Announcement Side Search */}
          <div className="user-search-container">
            <UserAnnoListSearch />
          </div>
        </div>
      </div>
      <div className="user-footer">
        <UserFooter />
      </div>
    </div>
  );
}
