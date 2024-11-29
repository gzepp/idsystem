import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { parse, format } from "date-fns";
import { fetchAnnouncerecord } from "../../../utils";

import "../css/user_eventshomepage.css";

const UserHomePageEvents = () => {
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Events");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const [filteredData, setFilteredData] = useState([]);
  const [originalData, setOriginalData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedStaffData = await fetchAnnouncerecord();
        return fetchedStaffData.reverse();
      } catch (error) {
        console.error(error);
        throw error;
      }
    };

    fetchData()
      .then((fetchedStaffData) => {
        // Filter only the events
        const eventAnnouncements = fetchedStaffData.filter(
          (annocard) => annocard.tags === "Events"
        );
        setOriginalData(eventAnnouncements);
        setFilteredData(eventAnnouncements);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    // Watch for changes in searchText and reset filters
    filterAnnouncements(searchText);
  }, [searchText]);

  const handleSearch = (text) => {
    setSearchText(text);
    setCurrentPage(1);
  };

  const filterAnnouncements = (text) => {
    const filtered = originalData.filter((annocard) => {
      const matchesSearch = annocard.title
        .toLowerCase()
        .includes(text.toLowerCase());
      return matchesSearch;
    });

    const sortedData = filtered.sort((a, b) => {
      const dateA = new Date(a.dateposted);
      const dateB = new Date(b.dateposted);
      return dateB - dateA;
    });

    setFilteredData(sortedData);
  };

  const currentItems = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  return (
    <div className="eventlist-main-body">
      <div className="eventlist-container">
        <div className="eventlist-header">
          <div className="eventlist-header-det">
            <span className="eventlist-header-icon">
              <i className="bx bx-calendar"></i>
            </span>
            <span className="eventlist-header-text">Upcoming Events</span>
          </div>
        </div>

        <div className="event-list-container">
          <div className="eventlist-links-container">
            {currentItems.length > 0 ? (
              currentItems.map((annocard, index) => (
                <Link
                  to={`/user_annoview/${encodeURIComponent(
                    JSON.stringify(annocard)
                  )}`}
                  className="anno-linking-page"
                  key={annocard.postId}
                >
                  <div className="eventlist-title-card-1" key={index}>
                    <span className="event-det-time">
                      <span className="month-event">
                        {format(
                          parse(
                            annocard.dateposted,
                            "yyyy-MM-dd'T'HH:mm:ss.SSSXXX",
                            new Date()
                          ),
                          "MMM"
                        )}
                      </span>
                      <span className="day-event">
                        {format(
                          parse(
                            annocard.dateposted,
                            "yyyy-MM-dd'T'HH:mm:ss.SSSXXX",
                            new Date()
                          ),
                          "dd"
                        )}
                      </span>
                    </span>

                    <div className="eventlist-details">
                      <span className="eventlist-title">{annocard.title}</span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="anno-data-not-found">Data not found.</div>
            )}
          </div>
        </div>
        <div className="eventlist-bottom">
          <div className="anno-pagination">
            <span
              className="anno-search-prev"
              onClick={() => paginate(currentPage - 1)}
            >
              <i className="bx bx-chevron-left"></i>
            </span>
            <span
              className="anno-search-next"
              onClick={() => paginate(currentPage + 1)}
            >
              <i className="bx bx-chevron-right"></i>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHomePageEvents;
