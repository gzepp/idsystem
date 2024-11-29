import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AdminSidebar, AdminTopbar } from "../../components";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
import { axisClasses } from "@mui/x-charts";
import { parse, format } from "date-fns";

import "./admin_css/admin_anno_post.css";
import "./admin_css/admin_dashboard.css";

import { validateUsers, useAppUniidContext } from "../../context";
import {
  getData,
  getBarData,
  fetchAnnouncerecord,
  fetchEntryrecord,
  fetchStaff,
  decrypt,
  getEntryRdata,
} from "../../utils";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [globalState, dispatch] = useAppUniidContext();

  const [annoData, setAnnoData] = useState([]);
  const [originalannoData, setoriginalAnnoData] = useState([]);

  const [origAttendanceRecords, setOrigAttendanceRecords] = useState([]); // Original data
  const [attendanceRecords, setAttendanceRecords] = useState([]); // Filtered data

  const [staffs, setStaffs] = useState([]);

  const [dataFetched, setDataFetched] = useState(false);
  //Dashboard Card Variables
  const [totalregUser, settotalregUser] = useState();
  const [presentToday, setpresentToday] = useState();
  const [lateToday, setlateToday] = useState();
  const [absentToday, setabsentToday] = useState();
  const [timeIntoday, settimeIntoday] = useState();
  const [timeOuttoday, settimeOuttoday] = useState();
  //Dashboard Graph Variables
  const [maxStudents, setmaxStudents] = useState();

  const [presentInWeek, setpresentInWeek] = useState();

  //feching is splitted for speed
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the necessary data for each of the four variables

        const presentTodayPayload = { countTotal: "present" };
        const lateTodayPayload = { countTotal: "late" };
        const absentTodayPayload = { countTotal: "absent" };

        // Fetch the data for each variable

        const presentTodayData = await getData(presentTodayPayload);
        const lateTodayData = await getData(lateTodayPayload);
        const absentTodayData = await getData(absentTodayPayload);

        // setDataFetched(true);
        // Assign the data to the useState variables

        setpresentToday(presentTodayData);
        setlateToday(lateTodayData);
        setabsentToday(absentTodayData);
        //bar graph
      } catch (error) {
        console.error(error);
        throw error; // Re-throw the error for error handling
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const presentInWeekPayload = { countTotal: "presentInWeek" };
        const presentInWeekData = await getBarData(presentInWeekPayload);

        // Convert the values to integers
        const parsedPresentInWeekData = {};
        for (const key in presentInWeekData) {
          parsedPresentInWeekData[key] = parseInt(presentInWeekData[key], 10);
        }

        setpresentInWeek(parsedPresentInWeekData);
        setDataFetched(true);
      } catch (error) {
        console.error(error);
        throw error;
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the necessary data for each of the four variables
        const totalregUserPayload = { countTotal: "student" };
        // const presentInWeekPayload = { countTotal: "presentInWeek" };

        // Fetch the data for each variable
        const totalregUserData = await getData(totalregUserPayload);
        //  const presentInWeekData = await getBarData(presentInWeekPayload);

        // Assign the data to the useState variables
        settotalregUser(totalregUserData);
        // setpresentInWeek(presentInWeekData);
        //bar graph
        setmaxStudents(totalregUserData);
      } catch (error) {
        console.error(error);
        throw error; // Re-throw the error for error handling
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the necessary data for each of the four variables

        const timeIntodayPayload = { countTotal: "timeInR" };
        const timeOuttodayPayload = { countTotal: "timeOutR" };
        // Fetch the data for each variable

        const timeIntodayData = await getEntryRdata(timeIntodayPayload);
        const timeOuttodayData = await getEntryRdata(timeOuttodayPayload);
        //setDataFetched(true);
        // Assign the data to the useState variables

        settimeIntoday(timeIntodayData);
        settimeOuttoday(timeOuttodayData);
      } catch (error) {
        console.error(error);
        throw error; // Re-throw the error for error handling
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // function that fetches the data
    const fetchData = async () => {
      try {
        const fetchedStaffData = await fetchAnnouncerecord(); // Fetch the data

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
        //console.log("new orig", annoData, "new data", originalannoData);
      })

      .catch((error) => {
        console.error(error);
      });
  }, []);

  //Attendance Fetcher
  useEffect(() => {
    // Fetch attendance records
    const fetchAttendanceData = async () => {
      try {
        const fetchedAttendanceData = await fetchEntryrecord();
        setAttendanceRecords(fetchedAttendanceData.reverse());
      } catch (error) {
        console.error("Error fetching attendance records:", error);
      }
    };

    fetchAttendanceData();
  }, []); // The dependency array ensures that this effect runs only once

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedStaffData = await fetchStaff(); // Fetch the data

        const decryptedStaffs = fetchedStaffData.map((staff) => {
          const decryptField = (field) => {
            if (field && field.data) {
              field = decrypt(field.data, field.iv);
            }
            return field;
          };

          staff.birthDay = decryptField(staff.birthDay);
          staff.birthPlace = decryptField(staff.birthPlace);
          staff.contactNo = decryptField(staff.contactNo);
          staff.gender = decryptField(staff.gender);
          staff.userFName = decryptField(staff.userFName);
          staff.userLName = decryptField(staff.userLName);
          staff.userMName = decryptField(staff.userMName);
          staff.userExt = decryptField(staff.userExt);

          return staff;
        });

        return decryptedStaffs;
      } catch (error) {
        console.error(error);
        throw error; // Re-throw the error for error handling
      }
    };
    // Call the function to fetch and assign the data
    fetchData()
      .then((decryptedStaffs) => {
        setStaffs(decryptedStaffs); // Assign the data to staffs
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  //validate function admin
  const validate = async () => {
    try {
      // Get the token JSON string from sessionStorage
      const tokenString = window.sessionStorage.getItem("profile");

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

  if (!dataFetched) {
    // Render a loading indicator or return null while waiting for data
    return (
      <div className="loading-overlay">
        <span className="loading-container">
          <span className="loading-icon-animation"></span>
        </span>
        <span className="loading-text">Loading...</span>
      </div>
    );
  }
  //Datas (Bargraph)
  // const maxStudents = 2654; // The maximum number of students
  const chartSetting = {
    yAxis: [
      {
        label: "",
        domain: [0, maxStudents], // Sets the max student sa y-axis
      },
    ],
    width: 400,
    height: 300,
    sx: {
      [`.${axisClasses.left} .${axisClasses.label}`]: {
        transform: "translate(-20px, 0)",
      },
    },
  };

  // Calculate absent values for each day
  const dataset = [
    {
      present: presentInWeek.dayone,
      absent: maxStudents - presentInWeek.dayone,
      day: "current",
    },
    {
      present: presentInWeek.daytwo,
      absent: maxStudents - presentInWeek.daytwo,
      day: "1 day ago",
    },
    {
      present: presentInWeek.daythree,
      absent: maxStudents - presentInWeek.daythree,
      day: "2 day ago",
    },
    {
      present: presentInWeek.dayfour,
      absent: maxStudents - presentInWeek.dayfour,
      day: "3 day ago",
    },
    {
      present: presentInWeek.dayfive,
      absent: maxStudents - presentToday,
      day: "4 day ago",
    },
    {
      present: presentInWeek.daysix,
      absent: maxStudents - presentInWeek.daysix,
      day: "5 day ago",
    },
    {
      present: presentInWeek.dayseven,
      absent: maxStudents - presentInWeek.dayseven,
      day: "6 day ago",
    },
  ];

  const valueFormatter = (value) => {
    if (typeof value === "number" && !isNaN(value)) {
      return value.toLocaleString();
    } else {
      return ""; // Return an empty string or another default value if value is not a valid number
    }
  };

  // Datas (DonutGraph)
  const data = [
    {
      label: "Time in Ratio",
      value: timeIntoday,
      color: "#81C891",
      typography: {
        fontFamily: "Roboto-Regular",
      },
    },
    {
      label: "Time out Ratio",
      value: timeOuttoday,
      color: "#FFD777",
    },
  ];

  // Calculate the total value of all data points
  const total = data.reduce((acc, dataPoint) => acc + dataPoint.value, 0);

  // Dummy Date Range
  const dummyDate = [
    {
      entryDatetime: "2023-10-16T07:50:50.167+00:00",
    },
    {
      entryDatetime: "2023-10-20T07:50:50.167+00:00",
    },
  ];

  // Parse the entryDatetime strings into Date objects
  const startDate = new Date();
  const endDate = new Date(dummyDate[1].entryDatetime);

  // Define date formatting options
  const dateOptions = { year: "numeric", month: "long", day: "numeric" };
  const formattedStartDate = startDate.toLocaleDateString("en-PH", dateOptions);
  const formattedEndDate = endDate.toLocaleDateString("en-PH", dateOptions);

  // Combine formatted dates into the desired format
  const dateRange = `${formattedStartDate} `;

  // - ${formattedEndDate}

  //Announcements Fetcher

  const getStaffName = (scannedBy) => {
    const staff = staffs.find((staff) => staff.idNumber === scannedBy);
    if (staff) {
      return `${staff.userFName} ${staff.userLName}`;
    }
    return "Unknown Staff";
  };

  return (
    <div className="admin-dashboardpage">
      <div className="admin-sidebar">
        <AdminSidebar />
      </div>
      <div className="admin-dashboard-contents">
        <AdminTopbar pageName="Admin Dashboard" />
        <div className="admin-dash-contents">
          {/* Dashboard Contents */}
          <div className="dashboard-main-container">
            {/* Card Count Cards */}
            <div className="dashboard-cards-container">
              {/* Registered Users */}
              <div className="card-container">
                <div className="card-count-details">
                  <div className="card-left-container">
                    <span className="registered-card-icon">
                      <i className="bx bxs-user"></i>
                    </span>
                  </div>
                  <div className="card-right-container">
                    <span className="card-count">{totalregUser}</span>
                    <span className="card-det">Registered Users</span>
                  </div>
                </div>
              </div>
              {/* Present Today */}
              <div className="card-container">
                <div className="card-count-details">
                  <div className="card-left-container">
                    <span className="present-card-icon">
                      <i className="bx bx-log-in-circle"></i>
                    </span>
                  </div>
                  <div className="card-right-container">
                    <span className="card-count">{presentToday}</span>
                    <span className="card-det">Present Today</span>
                  </div>
                </div>
              </div>
              {/* Late Attendees */}
              <div className="card-container">
                <div className="card-count-details">
                  <div className="card-left-container">
                    <span className="late-card-icon">
                      <i className="bx bx-timer"></i>
                    </span>
                  </div>
                  <div className="card-right-container">
                    <span className="card-count">{lateToday}</span>
                    <span className="card-det">Late Attendees</span>
                  </div>
                </div>
              </div>
              {/* Absentees */}
              <div className="card-container-last">
                <div className="card-count-details">
                  <div className="card-left-container">
                    <span className="absent-card-icon">
                      <i className="bx bx-question-mark"></i>
                    </span>
                  </div>
                  <div className="card-right-container">
                    <span className="card-count">{absentToday}</span>
                    <span className="card-det">Absentees Today</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts and Graphs */}
            <div className="dashboard-bar-pie">
              {/* Bargraph */}
              <div className="dashboard-bar-container">
                <div className="dashboard-bargraph">
                  {/* Bargraph Header */}
                  <div className="bargraph-header">
                    <span className="bar-header-text">
                      PRESENT-ABSENT COMPARISON OF THE WEEK
                    </span>
                    <span className="bar-header-datespan">
                      From: {dateRange}
                    </span>
                  </div>
                  {/* Bargraph Body */}
                  <div className="bargraph-body">
                    <BarChart
                      dataset={dataset}
                      xAxis={[{ scaleType: "band", dataKey: "day" }]}
                      series={[
                        {
                          dataKey: "present",
                          label: "No. of Present",
                          valueFormatter,
                          color: "#81C891",
                        },
                        {
                          dataKey: "absent",
                          label: "No. of Absentees",
                          valueFormatter,
                          color: "#D87575",
                        },
                      ]}
                      {...chartSetting}
                    />
                  </div>
                </div>
              </div>

              {/* Donut Graph */}
              <div className="dashboard-donut-container">
                <div className="dashboard-donut">
                  {/* Donut Header */}
                  <div className="donut-header">
                    <span className="donut-header-txt">
                      TIME IN - TIME OUT RATIO
                    </span>
                    <span className="donut-datespan">From: {dateRange}</span>
                  </div>
                  {/* Donut Body */}
                  <div className="donut-body">
                    <div className="donut-details">
                      {/* Donut Success */}
                      <div className="donut-suc">
                        <span className="donut-percentage">
                          {(data[0].value / total) * 100}%
                        </span>
                        <div className="donut-percentage-det">
                          <div className="succ-circle"></div>
                          <span className="circle-det">
                            Successful Time In - User{" "}
                          </span>
                        </div>
                      </div>
                      {/* Donut Fail */}
                      <div className="donut-fail">
                        <span className="donut-percentage">
                          {(data[1].value / total) * 100}%
                        </span>
                        <div className="donut-percentage-det">
                          <div className="fail-circle"></div>
                          <span className="circle-det">
                            Successful Time Out - User{" "}
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* Donut Main Container */}
                    <div className="donut-main">
                      <PieChart
                        series={[
                          {
                            paddingAngle: 5,
                            innerRadius: 60,
                            outerRadius: 95,
                            data,
                          },
                        ]}
                        margin={{ right: 5 }}
                        width={200}
                        height={200}
                        legend={{ hidden: true }}
                        className="donut-main-content"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent and Announcements */}
            <div className="dashboard-recent-anno">
              {/* Recent Logs */}
              <div className="recent-act-container">
                <div className="recent-act-details">
                  <div className="recent-act-header">
                    <i className="bx bx-time-five"></i>
                    <span className="recent-act-txt">Recent Scanning Logs</span>
                  </div>
                  <div className="recent-act-body">
                    {/* Recent Activity Log Container */}
                    {attendanceRecords.slice(0, 6).map((att_records, index) => (
                      <div className="act-log-container">
                        <div className="recent-indicator"></div>
                        <div className="recent-det-container">
                          <div className="recent-details">
                            <span className="recent-name">
                              {getStaffName(att_records.scannedBy)}
                            </span>{" "}
                            <span className="recent-misc">
                              {att_records.logType === "Time in"
                                ? "scanned in"
                                : "scanned out"}
                            </span>
                            {/* If log type is Time in = scanned-in */}
                            <span className="recent-name">
                              {att_records.studentName},
                            </span>
                            <span className="recent-location">
                              {att_records.placeOfentry}
                            </span>
                          </div>
                          <span className="recent-date">
                            {format(
                              parse(
                                att_records.entryDatetime,
                                "yyyy-MM-dd'T'HH:mm:ss.SSSXXX",
                                new Date()
                              ),
                              "MM/dd/yyyy - h:mm a"
                            )}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* Latest Announcements and Events */}
              <div className="latest-anno-container">
                <div className="latest-anno-content">
                  {/* Latest Announcements Header */}
                  <div className="latest-anno-header">
                    <div className="latest-anno-left">
                      <span className="latest-anno-text">
                        ANNOUNCEMENTS AND EVENTS
                      </span>
                      <span className="latest-anno-desc">Latest posts</span>
                    </div>
                    <div className="latest-anno-right">
                      <Link to="/admin_anno_list" className="anno-linking-page">
                        <span className="latest-anno-btn">View More</span>
                      </Link>
                    </div>
                  </div>
                  {/* Latest Announcements Body */}
                  <div className="latest-anno-table">
                    <table className="dashboard-anno">
                      <thead className="dashboard-anno-header">
                        <tr>
                          <td className="large-det-container">Post ID</td>
                          <td className="larger-det-container">Title</td>
                          <td className="large-det-container">Date & Time</td>
                          <td className="small-det-container">Type</td>
                        </tr>
                      </thead>
                      {/* Table Contents */}
                      <tbody className="dashboard-anno-body">
                        {annoData.slice(0, 5).map((anno, index) => (
                          <tr className="anno-row-data" key={anno.postId}>
                            <td className="large-det-container">
                              {anno.postId}
                            </td>
                            <td className="larger-det-container">
                              {anno.title}
                            </td>
                            <td className="large-det-container">
                              {format(
                                parse(
                                  anno.dateposted,
                                  "yyyy-MM-dd'T'HH:mm:ss.SSSXXX",
                                  new Date()
                                ),
                                "MM/dd/yyyy - h:mm a"
                              )}
                            </td>
                            <td className="small-det-container">{anno.tags}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
