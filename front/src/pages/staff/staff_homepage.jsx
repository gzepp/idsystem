import React, { useEffect, useState } from "react";
import { StaffTopbar, StaffFooter } from "../../components";
import { Link, useNavigate } from "react-router-dom";
import { parse, format } from "date-fns";
import QrReader from "react-qr-reader";

import "./css/staff_homepage.css";

// Local Images
import succ_scan from "../../assets/qr_success.png";
import fail_scan from "../../assets/qr_fail.png";

import {
  USER_ACTION,
  validateUsers,
  useAppUniidContext,
  recordEntry,
} from "../../context";

import { decrypt } from "../../utils";

export default function StaffHomepage() {
  const navigate = useNavigate();
  const [globalState, dispatch] = useAppUniidContext();
  const [scanning, setScanning] = useState(false);
  const [scanEnabled, setScanEnabled] = useState(true); // Toggle scanner
  const [scanCooldown, setScanCooldown] = useState(false); // Add cooldown
  const [lastScannedData, setLastScannedData] = useState(""); // Track the last scanned data to prevent re-scan

  // Scanner variables and functions
  const [selected, setSelected] = useState("environment");
  const [loadingScan, setLoadingScan] = useState(false);
  const [data, setData] = useState({}); //student data
  const [errorMessage, setErrorMessage] = useState("");
  const [staff_userData, setStaff_userData] = useState({});
  const [isSmstrue, setisSmstrue] = useState(false);

  const [qrdata, setqrData] = useState({
    placeOfentry: "Gate 1",
    logType: "Time in",
    studentQR: "",
  });

  let cameraAccess;

  const startScanning = async () => {
    try {
      cameraAccess = await navigator.mediaDevices.getUserMedia({ video: true });
      if (cameraAccess) {
        setScanning(true);
        setLoadingScan(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const stopScanning = () => {
    setScanning(false);
    if (cameraAccess) {
      cameraAccess.getTracks().forEach((track) => track.stop());
    }
  };

  let processing = false;

  const handleScan = async (scanData) => {
    if (scanEnabled) {
      setLoadingScan(true);
      if (scanData && scanData !== "") {
        if (scanData !== lastScannedData && !processing) {
          // Set the processing flag to true to prevent multiple calls
          processing = true;

          try {
            const qrData = {
              placeOfentry: qrdata.placeOfentry, // Assign the value from the select elements
              logType: qrdata.logType, // Assign the value from the select elements
              studentQR: scanData, // Create a JSON object with the provided QR code
              scannedBy: staff_userData.idNumber,
              smsTrue: isSmstrue,
            };

            // Call your recordEntry function with the parsed data
            const res = await recordEntry(dispatch, qrData);

            if (res.status === 200) {
              // Display the entry response on the frontend and set it to the 'data' state
              console.log("Entry response:", res.data);
              setData(res.data);

              // Clear the data after a delay (e.g., 5 seconds)
              setTimeout(() => {
                setData({});
              }, 20000);
            } else {
              setLoadingScan(false);
              setErrorMessage("Error: Unable to record entry.");
              setTimeout(() => {
                setErrorMessage("");
              }, 10000);
            }
          } catch (error) {
            // Handle JSON parsing error
            setLoadingScan(false);
            console.error("Error parsing scanData:", error);
            setErrorMessage("Error: Unable to record entry.");
            setTimeout(() => {
              setErrorMessage("");
            }, 5000);
          }

          setLastScannedData(scanData);

          // A condition to check if the scan data is different from the last one
          if (scanData !== lastScannedData) {
            setScanCooldown(true);
            stopScanning();

            setTimeout(() => {
              setScanEnabled(true);
              setScanCooldown(false);
              startScanning();
            }, 5000);
          }

          // Reset the processing flag to false
          processing = false;
        }
      }
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  // Checks if the scanner is toggled
  const isQrReaderReady = scanning && selected;

  //validate function
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
        if (userType !== "staff") {
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
        setStaff_userData(userData); // Store the original data
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div className="staff-body-container">
      <div className="staff-topbar">
        <StaffTopbar userName={staff_userData.userFName} />
      </div>

      <div className="staff-main-contents">
        <div className="staff-body-limiter">
          <div className="staff-misc-body">
            <div className="staff-profile-contents">
              <div className="staff-cover-pfp">
                <div className="staff-cover"></div>
              </div>
              <div className="staff-details-container">
                <div
                  className="staff-picture"
                  style={{
                    backgroundImage: `url(https://res.cloudinary.com/debe9q66f/image/upload/${staff_userData.pfpPic})`,
                  }}
                ></div>

                <span className="staff-det">
                  <span className="staff-name">
                    {" "}
                    {staff_userData.userFName} {staff_userData.userMName}{" "}
                    {staff_userData.userLName} {staff_userData.userExt}
                  </span>
                  <span className="staff-number">
                    Employee No: {staff_userData.idNumber}
                  </span>
                </span>
              </div>
            </div>
            <div className="staff-instruction-container">
              <div className="staff-empty"></div>
              <div className="staff-instruction-det">
                <span className="staff-inst-header">
                  <div className="qr-cont">
                    <i className="bx bx-qr-scan"></i>
                  </div>
                  <span className="staff-header-txt">How to use?</span>
                  <span className="staff-header-det">
                    A simple step by step guide on using the UniID QR Code
                    Scanner
                  </span>
                </span>

                <div className="inst-det-1-2">
                  <span className="inst-1">
                    1. Scan the UniID QR Code from the Student’s ID using
                    smartphone.
                  </span>
                  <span className="inst-2">
                    2. Simply tap the interface once the successful scanning
                    prompt pops up to proceed on scanning other QR.{" "}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="staff-camera-wrapper">
            <div className="staff-camera-container">
              <div className="camera-header">
                <span className="camera-header">
                  <span className="qr-scanner-title">QR Code Scanner</span>
                  <span className="qr-scanning-details">
                    Scanning from: {qrdata.placeOfentry}, Type:{qrdata.logType}
                  </span>
                  <div className="camera-conf-btn">
                    <span className="qr-logtype-btn">
                      <select
                        onChange={(e) =>
                          setqrData({ ...qrdata, logType: e.target.value })
                        }
                      >
                        <option value="Time in">Time in</option>
                        <option value="Time out">Time out</option>
                      </select>
                    </span>

                    <span className="qr-loc-btn">
                      <select
                        onChange={(e) =>
                          setqrData({ ...qrdata, placeOfentry: e.target.value })
                        }
                      >
                        <option value="Gate 1">Gate 1</option>
                        <option value="Gate 2">Gate 2</option>
                      </select>
                    </span>
                  </div>
                </span>
              </div>

              <div className="camera-main-container">
                {isQrReaderReady && (
                  <>
                    <QrReader
                      facingMode={selected}
                      delay={1000}
                      onError={handleError}
                      onScan={handleScan}
                      style={{ width: "300px" }}
                    />
                    {loadingScan && (
                      <span className="scan-status">Scanning QR Code...</span>
                    )}
                    <span className="cam-switch-btn">
                      <select onChange={(e) => setSelected(e.target.value)}>
                        <option value={"environment"}>Back Camera</option>
                        <option value={"user"}>Front Camera</option>
                      </select>
                    </span>
                  </>
                )}
              </div>

              <div className="cam-scanner-footer">
                <button
                  className="initiate-cam-btn"
                  onClick={() => {
                    if (scanning) {
                      stopScanning();
                    } else {
                      if (!scanCooldown) {
                        startScanning();
                      }
                    }
                  }}
                >
                  {scanning ? "STOP SCAN" : "START SCAN"}
                </button>
              </div>

              {data.idNumber && (
                <div className="qr-scan-overlay">
                  <div className="scan-header">
                    <span className="student-pfp-scan">
                      <img
                        src={`https://res.cloudinary.com/debe9q66f/image/upload/${data.pfpPic}`}
                        alt="Student's Profile Picture"
                      />
                    </span>
                    <span className="student-namedet-scan">
                      <span className="student-name-txt">
                        {data.studentName}
                      </span>
                      <span className="student-namedet-txt">
                        {data.idNumber}
                      </span>
                    </span>
                  </div>
                  <div className="scan-body">
                    <span className="scan-status-qr">
                      QR Code Successfully Scanned
                    </span>
                    <div className="scan-qr-det">
                      <span className="student-entry-txt">
                        {format(
                          parse(
                            data.entryDatetime,
                            "yyyy-MM-dd'T'HH:mm:ss.SSSXXX",
                            new Date()
                          ),
                          "MMMM dd, yyyy - hh:mm a"
                        )}
                      </span>
                      <span className="student-entry-txt">
                        {data.placeOfentry} {"-"}
                        {data.logType}
                      </span>
                    </div>
                    <div className="succ-icon-qr">
                      <img src={succ_scan} alt="Successful Scan" />
                    </div>
                  </div>
                  <div className="scan-footer"></div>
                </div>
              )}

              {errorMessage && (
                <div className="qr-scan-overlay">
                  <div className="scan-header">
                    <span className="student-pfp-scan">
                      <i className="bx bx-error-circle"></i>
                    </span>
                    <span className="student-namedet-scan">
                      <span className="student-name-txt">User Not Found</span>
                      <span className="student-namedet-txt">Unknown</span>
                    </span>
                  </div>
                  <div className="scan-body">
                    <span className="scan-status-qr">Invalid QR Code</span>
                    <div className="scan-qr-det">
                      <span className="student-entry-txt">
                        Sacred Heart Academy
                      </span>
                      <span className="student-entry-txt">
                        of Santa Maria, Bulacan{" "}
                      </span>
                    </div>
                    <div className="succ-icon-qr">
                      <img src={fail_scan} alt="Fail Scan" />
                    </div>
                  </div>
                  <div className="scan-footer"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="staff-footer">
        <StaffFooter />
      </div>
    </div>
  );
}
