import React, { useState, useEffect } from "react";
import { UserFooter, UserTopbar } from "../../components";
import { Link, useNavigate } from "react-router-dom";
import { Carousel } from "antd";

import admin_logo from "../../assets/sha_logo.png";
import "./css/user_annolist.css";

import UserAnnoListSearch from "./data/user_component_sidesearch";
import AnnoCarousel from "./data/user_AnnoCarousel";
import AnnoCardGallery from "./data/user_AnnoCardGallery";

//function import
import { fetchAnnouncerecord } from "../../utils";
import { validateUsers, useAppUniidContext } from "../../context";

export default function UserAnnoList() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [student_userData, setStudent] = useState({});
  const [globalState, dispatch] = useAppUniidContext();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [totalAnno, setTotalAnno] = useState(0);

  const [annoData, setAnnoData] = useState([]);
  const [originalannoData, setoriginalAnnoData] = useState([]);

  const totalPages = Math.ceil(totalAnno / itemsPerPage);

  //Announcements Data List
  useEffect(() => {
    // function that fetches the data
    const fetchData = async () => {
      try {
        const fetchedStaffData = await fetchAnnouncerecord(); // Fetch the data
        console.log("res ", fetchedStaffData);
        return fetchedStaffData;
      } catch (error) {
        console.error(error);
        throw error; // Re-throw the error for error handling
      }
    };

    // Call the function to fetch and assign the data
    fetchData()
      .then((fetchedStaffData) => {
        setoriginalAnnoData(fetchedStaffData); // Store the original data
        setAnnoData(fetchedStaffData); // Assign the data to students
        console.log("new orig", annoData, "new data", originalannoData);
      })

      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleTotalAnnoChange = (count) => {
    setTotalAnno(count);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

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
    validate();
    getProfile()
      .then((userData) => {
        setStudent(userData); // Store the original data
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  //Announcements Data for Carousel
  const [carouselData, setCarouselData] = useState([]);

  useEffect(() => {
    // Function that fetches the announcement data and keeps only the three most recent posts
    const fetchData = async () => {
      try {
        const fetchedAnnouncementData = await fetchAnnouncerecord();
        console.log("Fetched Announcement Data: ", fetchedAnnouncementData);

        // Keep only the three most recent posts
        const mostRecentPosts = fetchedAnnouncementData.slice(0, 3);
        setCarouselData(mostRecentPosts);
      } catch (error) {
        console.error("Error fetching announcement data: ", error);
      }
    };

    fetchData();
  }, []);

  // //Dummy Data for User
  // const student_userData = [
  //   {
  //     idNumber: "2020102397",
  //     userFName: "Aries",
  //     userMName: "Pascual",
  //     userLName: "Joestar",
  //     userExt: "",
  //     acadLevel: "College",
  //     course: "BS in Management Accounting",
  //     yearLevel: "4th Year",
  //     pfpPic: "alumnigga_zguvwi.png",
  //     studentQR: "$2a$06$ccIA9PxusZG/F7WaoCNF6OZJ2oIYw6CPqoptXYnGU1xIw.19hfpf.",
  //     uType: "user",
  //   },
  // ];

  return (
    <div className="user-body-container">
      <div className="user-topbar">
        <UserTopbar userName={student_userData.userFName} />
        <div className="lower-topbar-wrapper">
          <div className="lower-topbar">
            <span className="lower-topbar-text">
              <Link to="/user_homepage" className="top-linking-page">
                <span className="active-linking">Home {""}</span>
              </Link>
              {"/"}
              <span className="inactive-link"> Announcements Section</span>
            </span>
          </div>
        </div>
        <div className="announcement-cover-banner">
          <span className="anno-section-txt">Announcements Section</span>
          <div className="anno-section-bot"></div>
        </div>
      </div>

      <div className="user-main-contents">
        <div className="user-body-limiter">
          <div className="announcement-userlist-container">
            {/* Announcements Carousel */}
            <div className="carousel-container-wrapper">
              <div className="carousel-container-annolist">
                <div className="carousel-container">
                  <AnnoCarousel carouselData={carouselData} />
                </div>
              </div>
            </div>
            {/* Announcements Card Container */}
            <div className="announcements-cards-container">
              <AnnoCardGallery
                annoData={annoData}
                setAnnoData={setAnnoData}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                totalPages={totalPages}
                onUpdateTotalAnno={handleTotalAnnoChange}
              />
            </div>
            <div className="annolist-footer">
              <div className="page-next-prev-btn-container">
                <span
                  className="prev-btn"
                  onClick={() => {
                    if (currentPage > 1) {
                      handlePageChange(currentPage - 1);
                    }
                  }}
                >
                  Previous
                </span>

                <span className="page-num-indicator">
                  <span className="page-num-indicator-txt">Page</span>
                  <span className="page-indicator-main">
                    <span className="shaded-num-indicator-cont">
                      <span className="num-indicator-cont-1">
                        {currentPage}
                      </span>
                    </span>
                    <span className="page-num-indicator-txt">of</span>
                    <span className="num-indicator-cont-2">{totalPages}</span>
                  </span>
                </span>

                <span
                  className="next-btn"
                  onClick={() => {
                    if (currentPage < totalPages) {
                      handlePageChange(currentPage + 1);
                    }
                  }}
                >
                  Next
                </span>
              </div>
            </div>
          </div>
          {/* Announcement Side Search */}
          <div className="annolist-sidesearch-container">
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
