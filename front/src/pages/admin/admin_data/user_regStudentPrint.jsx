import React, { useState, useRef } from "react";
import { Input, QRCode, Space } from "antd";
import rep_wallpaper from "../../../assets/shashasha.png";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import SHA_logo from "../../../assets/sha_logo.png";
import SHA_name from "../../../assets/SHASM_ID_Name.png";

import "../admin_css/user_popupPrint.css";

const PrintIDForm = ({ student }) => {
  const {
    idNumber,
    userFName,
    userMName,
    userLName,
    userExt,
    acadLevel,
    course,
    yearLevel,
    perAddress,
    perProvince,
    perMuniCity,
    perBarangay,
    pfpPic,
    parentGuardianName,
    parentGuardianContact,
    studentQR,
  } = student;

  const [text, setText] = React.useState("https://ant.design/");

  const frontIdRef = useRef(null);
  const backIdRef = useRef(null);

  const generatePDF = async () => {
    const frontIdContainer = frontIdRef.current;
    const backIdContainer = backIdRef.current;

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [54, 85], // CR50 size
    });

    const options = {
      scale: 5,
      useCORS: true,
    };

    const frontCanvas = await html2canvas(frontIdContainer, options);
    const frontIdImage = frontCanvas.toDataURL("image/png");
    pdf.addImage(frontIdImage, "PNG", 0, 0, 54, 85);

    pdf.addPage();

    const backCanvas = await html2canvas(backIdContainer, options);
    const backIdImage = backCanvas.toDataURL("image/png");
    pdf.addImage(backIdImage, "PNG", 0, 0, 54, 85);

    const studentName = `${idNumber}_${userFName}_${userLName}`;
    const fileName = `Student_ID_${studentName}.pdf`;

    pdf.save(fileName);
  };
  return (
    <div className="print-ID-container">
      <div className="id-pages-wrapper">
        <div className="front-id-container">
          <div className="front-id-contents" ref={frontIdRef}>
            <div className="left-design-container">
              <span className="rep-wallpaper">
                <img
                  src={rep_wallpaper}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                  alt="SHASM SHA SHA"
                />
              </span>
              <span className="school-logo-overlap">
                <img src={SHA_logo} alt="SHASM Logo" />
              </span>
              <span className="rep-wallpaper-line"></span>
            </div>
            <div className="right-design-container">
              <div className="school-name-container">
                <span className="school-name-txt">
                  <img
                    src={SHA_name}
                    alt="Sacred Heart Academy of Santa Maria (Bulacan) Inc."
                  />
                </span>
                <span className="school-address-txt">
                  Dr. Teofilo Santiago Street, Brgy. Poblacion, Sta.Maria,
                  Bulacan
                </span>
              </div>
              <div className="id-picture-container">
                <img
                  className="student-id-picture"
                  src={`https://res.cloudinary.com/debe9q66f/image/upload/${pfpPic}`}
                  alt="Student ID"
                  style={{
                    width: "110px",
                    height: "110px",
                  }}
                />
              </div>
              <div className="student-details-container">
                <span className="student-name-details">
                  <div className="id-student-det">
                    <span className="student-name">
                      {userFName}{" "}
                      {userMName
                        .split(" ")
                        .map((word) => word.charAt(0))
                        .join(".")}
                      {". "}
                      {userLName} {userExt}
                    </span>
                    <span className="sd-label">Name of Student</span>
                  </div>
                  <div className="id-stuno">
                    <span className="student-number">{idNumber}</span>
                    <span className="sd-label">Student Number</span>
                  </div>

                  <div className="id-cy-det">
                    {acadLevel === "College" ? (
                      <>
                        <span className="student-course">{course}</span>
                      </>
                    ) : (
                      <span className="student-course-year">{yearLevel}</span>
                    )}
                    <span className="sd-label">Course/Year Level</span>
                  </div>
                </span>
                <div className="ay-container">
                  <span className="ay-txt">A.Y.</span>
                  <span className="ay-span">2023-2024</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="back-id-container">
          <div className="back-id-contents" ref={backIdRef}>
            {/* Back Details */}
            <div className="id-back-details">
              {/* <div className="important-container">
                <span className="back-label">IMPORTANT</span>
                <span className="impt-det">
                  This ID card is non-transferable and is intended for the
                  exclusive use of the student throughout the indicated academic
                  year. It must be prominently displayed within the school
                  premises at all times, as part of the school’s uniform code.
                </span>
              </div> */}
              <div className="top-contact-container">
                {/* Parent Contact Name */}
                <span className="back-label">
                  In case of emergency, please notify:
                </span>
              </div>
              <div className="contact-container">
                <span className="cont-det">{parentGuardianName}</span>
              </div>

              {/* Parent Contact Number */}
              <div className="contact-container">
                <span className="back-label">Contact Details</span>
                <span className="cont-det">{parentGuardianContact}</span>
              </div>

              {/* Parent Contact Address */}
              <div className="contact-container">
                <span className="back-label">Address</span>
                <span className="cont-det">
                  {perAddress}
                  {","} {perBarangay}
                </span>
                <span className="cont-det">
                  {perMuniCity} {","} {perProvince}
                </span>
              </div>
            </div>
            {/* Emergency Details */}
            <div className="emergency-details-container">
              <span className="none-emergency-details">
                If found, please return to:{" "}
              </span>
              <span className="emphasis-emergency-details">
                SACRED HEART ACADEMY OF
              </span>
              <span className="emphasis-emergency-details">
                STA. MARIA (BULACAN) INC.
              </span>
              <span className="none-emergency-details">
                (044) 815-6739 / 0917-425-1963
              </span>
            </div>
            {/* QR Container */}
            <div className="qr-details">
              <div className="qr-container">
                <Space direction="vertical" align="center">
                  <div className="qr-code-container">
                    <QRCode value={studentQR || "-"} size={125} />
                  </div>
                  {studentQR ? null : (
                    <div className="input-container">
                      <Input
                        placeholder="-"
                        maxLength={200}
                        value={studentQR}
                        onChange={(e) => setText(e.target.value)}
                      />
                    </div>
                  )}
                </Space>
              </div>

              <div className="signatoree-container">
                <span className="e-signature-signatoree"></span>
                <span className="name-signatoree">
                  WILLAM DC. ENRIQUEZ, PhD.
                </span>
                <span className="signatoree-position">Principal</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="print-id-button">
        <span className="printing-id-btn" onClick={generatePDF}>
          Save as PDF
          <i className="bx bxs-file-pdf"></i>
        </span>
      </div>
    </div>
  );
};

export default PrintIDForm;
