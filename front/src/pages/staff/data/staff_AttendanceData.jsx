import React, { useEffect } from "react";
import "../css/staff_attendance_rec.css";
import { parse, format } from "date-fns";

const UserAttendanceRecordsData = ({
  attendanceRecords,
  searchQuery,
  entriesToShow,
  onAttendanceCountChange,
  currentPage,
  onPageChange,
  startDate,
  endDate,
}) => {
  const dateFormat = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX";

  const filteredRecords = attendanceRecords.filter((att_records) => {
    const entryDatetime = parse(
      att_records.entryDatetime,
      dateFormat,
      new Date()
    );

    const nameMatch = att_records.studentName
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    const idMatch = att_records.idNumber
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const isDateInRange =
      (!startDate || entryDatetime >= new Date(startDate)) &&
      (!endDate || entryDatetime <= new Date(endDate));

    return (nameMatch || idMatch) && isDateInRange;
  });

  const updateAttendanceCount = () => {
    onAttendanceCountChange(filteredRecords.length);
  };

  useEffect(() => {
    updateAttendanceCount();
  }, [filteredRecords]);

  useEffect(() => {
    updateAttendanceCount();
    onPageChange(currentPage);
  }, [searchQuery, entriesToShow, startDate, endDate]);

  useEffect(() => {
    onPageChange(currentPage);
  }, [currentPage]);

  if (filteredRecords.length === 0) {
    return <div className="no-data-found-message">No data found.</div>;
  }

  const totalPages = Math.ceil(filteredRecords.length / entriesToShow);
  const startIndex = (currentPage - 1) * entriesToShow;
  const endIndex = Math.min(startIndex + entriesToShow, filteredRecords.length);
  const currentPageData = filteredRecords.slice(startIndex, endIndex);

  //console.log(filteredRecords);
  return (
    <div>
      <table className="attendance-rec-main">
        <thead className="attendance-rec-header">
          <tr className="attendance-rec-row-header">
            <td className="small-det-container">Student Number</td>
            <td className="medium-det-container">Location</td>
            <td className="small-det-container">Date</td>
            <td className="small-det-container">Time</td>
            <td className="small-det-container">Log Type</td>
          </tr>
        </thead>
        <tbody className="attendance-rec-contents">
          {currentPageData.map((att_records, index) => (
            <tr key={index} className="attendance-rec-row-data">
              <td className="small-det-container">{att_records.idNumber}</td>

              <td className="medium-det-container">
                {att_records.placeOfentry}
              </td>

              <td className="small-det-container">
                {format(
                  parse(
                    att_records.entryDatetime,
                    "yyyy-MM-dd'T'HH:mm:ss.SSSXXX",
                    new Date()
                  ),
                  "MM/dd/yyyy"
                )}
              </td>
              <td className="small-det-container">
                {format(
                  parse(
                    att_records.entryDatetime,
                    "yyyy-MM-dd'T'HH:mm:ss.SSSXXX",
                    new Date()
                  ),
                  "h:mm a"
                )}
              </td>
              <td className="small-det-container">
                <span
                  className={`log-type ${
                    att_records.logType === "Time out" ? "Time-out" : "Time-In"
                  }`}
                >
                  {att_records.logType}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserAttendanceRecordsData;
