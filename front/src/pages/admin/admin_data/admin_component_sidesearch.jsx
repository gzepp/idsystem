import React, { useState, useEffect } from "react";
import "../admin_css/admin_anno_sidesearch.css";
import { Link } from "react-router-dom";
import { parse, format } from "date-fns";
import { fetchAnnouncerecord } from "../../../utils";

const AdminAnnoListSearch = () => {
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const [filteredData, setFilteredData] = useState([]);
  const [originalData, setOriginalData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedStaffData = await fetchAnnouncerecord();
        return fetchedStaffData;
      } catch (error) {
        console.error(error);
        throw error;
      }
    };

    fetchData()
      .then((fetchedStaffData) => {
        setOriginalData(fetchedStaffData);
        setFilteredData(fetchedStaffData);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    // Watch for changes in searchText and selectedCategory, and reset filters
    filterAnnouncements(searchText, selectedCategory);
  }, [searchText, selectedCategory]);

  const handleSearch = (text) => {
    setSearchText(text);
    setCurrentPage(1);
  };

  const filterAnnouncements = (text, category) => {
    const filtered = originalData.filter((annocard) => {
      const matchesCategory = category === "" || annocard.tags === category;
      const matchesSearch = annocard.title
        .toLowerCase()
        .includes(text.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    const sortedData = filtered.sort((a, b) => {
      const dateA = new Date(a.dateposted);
      const dateB = new Date(b.dateposted);
      return dateB - dateA;
    });

    setFilteredData(sortedData);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const currentItems = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  return (
    <div className="annolist-main-body">
      <div className="annolist-container">
        <div className="annolist-header">
          <div className="annolist-header-det">
            <span className="annolist-header-icon">
              <i className="bx bxs-megaphone"></i>
            </span>
            <span className="annolist-header-text">Announcements</span>
          </div>
        </div>

        <div className="annolist-search">
          <i className="bx bx-search-alt-2"></i>
          <div className="annolist-searchbar-container">
            <span className="anno-search-bar">
              <input
                type="text"
                placeholder="Search"
                value={searchText}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </span>
          </div>
        </div>
        <div className="category-container">
          <div className="annolist-subheader">
            <span className="a-subheader-text">Categories</span>
          </div>
          <div className="category-links">
            <span
              className={`category-links-det ${
                selectedCategory === "" ? "selected" : ""
              }`}
              onClick={() => handleCategorySelect("")}
            >
              All
            </span>
            <span
              className={`category-links-det ${
                selectedCategory === "News" ? "selected" : ""
              }`}
              onClick={() => handleCategorySelect("News")}
            >
              News
            </span>
            <span
              className={`category-links-det ${
                selectedCategory === "Events" ? "selected" : ""
              }`}
              onClick={() => handleCategorySelect("Events")}
            >
              Events
            </span>
          </div>
        </div>
        <div className="announcement-list-container">
          <div className="annolist-subheader">
            <span className="a-subheader-text">Recent Announcements List</span>
          </div>
          <div className="annolist-links-container">
            {currentItems.length > 0 ? (
              currentItems.map((annocard, index) => (
                <Link
                  to={`/admin_anno_view/${encodeURIComponent(
                    JSON.stringify(annocard)
                  )}`}
                  className="anno-linking-page"
                  key={annocard.postId}
                >
                  <div className="annolist-title-card-1" key={index}>
                    <span className="react-detail-indicator"></span>
                    <div className="annolist-details">
                      <span className="annolist-title">{annocard.title}</span>
                      <span className="post-det-time">
                        Date Posted:{" "}
                        {format(
                          parse(
                            annocard.dateposted,
                            "yyyy-MM-dd'T'HH:mm:ss.SSSXXX",
                            new Date()
                          ),
                          "MMMM dd, yyyy"
                        )}
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="anno-data-not-found">Data not found.</div>
            )}
          </div>
        </div>
        <div className="annolist-bottom">
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

export default AdminAnnoListSearch;
