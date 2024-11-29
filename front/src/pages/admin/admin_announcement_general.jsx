import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AdminSidebar, AdminTopbar } from "../../components";
import "./admin_css/admin_annolist.css";
import admin_logo from "../../assets/sha_logo.png";

//import announcementData from "./admin_data/annoData";
import AnnoListData from "./admin_data/admin_annoListData";
import AdminAnnoListSearch from "./admin_data/admin_component_sidesearch";

//function import
import { fetchAnnouncerecord } from "../../utils";
import { validateUsers, updateAnno, useAppUniidContext } from "../../context";

export default function AdminAnnouncementGeneralList() {
  const navigate = useNavigate();
  const [globalState, dispatch] = useAppUniidContext();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [totalAnno, setTotalAnno] = useState(0);

  const [annoData, setAnnoData] = useState([]);
  const [originalannoData, setoriginalAnnoData] = useState([]);

  const totalPages = Math.ceil(totalAnno / itemsPerPage);

  useEffect(() => {
    // function that fetches the data
    const fetchData = async () => {
      try {
        const fetchedStaffData = await fetchAnnouncerecord(); // Fetch the data
        //console.log("res ", fetchedStaffData);
        return fetchedStaffData.reverse();
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
        //console.log("new orig", annoData, "new data", originalannoData);
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

  const handleDelete = (postId) => {
    const payload = {
      postId: postId,
      isArchive: true,
    };

    console.log(payload);
    updateAnno(dispatch, payload);

    window.location.reload();
  };

  //validate function admin?
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
        if (userType !== "admin") {
          navigate("/");
          return;
        } else {
          return;
        }
      } else {
        navigate("/");
        return;
      }
    } catch (error) {
      navigate("/");
      return;
    }
  };

  useEffect(() => {
    validate();
  }, []);
  return (
    <div className="admin-u-regpage">
      <div className="admin-sidebar">
        <AdminSidebar />
      </div>
      <div className="admin-annolist-container">
        <AdminTopbar pageName="Announcements" />
        <div className="admin-annolist-contents">
          {/* Admin Post Main Form */}
          <div className="annolist-post-container-body">
            {/* Admin Announcement List Body  */}
            <div className="annolist-post-main-container">
              {/* Admin Post Header  */}
              <div className="annolist-post-header">
                <div className="annolist-poster-name-container">
                  <div className="annolist-user-pic">
                    <img alt="SHASM Admin" width="40px" src={admin_logo} />
                  </div>
                  <div className="annolist-post-click-container">
                    <Link to="/admin_anno_post" className="linking-page-anno">
                      <span className="annolist-post-click">
                        Post Announcement Here +
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
              {/* Admin AnnoList Body*/}
              <div className="annolist-lists-container">
                {/* Admin AnnoList Card*/}
                <AnnoListData
                  annoData={annoData}
                  setAnnoData={setAnnoData}
                  currentPage={currentPage}
                  itemsPerPage={itemsPerPage}
                  totalPages={totalPages}
                  onUpdateTotalAnno={handleTotalAnnoChange}
                  onDelete={handleDelete}
                />
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
                        <span className="num-indicator-cont-2">
                          {totalPages}
                        </span>
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
            </div>
          </div>
          <AdminAnnoListSearch />
        </div>
      </div>
    </div>
  );
}
