import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { parse, format } from "date-fns";

// AnnoCarousel.js
import "../css/announcement.css";
import initSwiper from "./initSwiper";

const AnnoCarousel = ({ carouselData }) => {
  useEffect(() => {
    initSwiper();
  }, []);

  return (
    <>
      <div className="news-container">
        <div className="news-background">
          <div className="news-section">
            <div className="swiper mySwiper">
              <div className="swiper-wrapper">
                {carouselData.map((annoItem) => (
                  <div className="swiper-slide card" key={annoItem.postId}>
                    <div className="card-content">
                      <div className="news-image">
                        <img
                          className="news-picture"
                          alt="Announcement Picture"
                          width="350px"
                          src={`https://res.cloudinary.com/debe9q66f/image/upload/${annoItem.postImage}`}
                        />
                      </div>
                      <div className="news-body">
                        <div className="news-headline-container">
                          <div className="news-status">
                            <div className="circle-icon"></div>
                            <p className="status-text">{annoItem.tags}</p>
                          </div>
                          <div className="news-title">
                            <span className="title-text">{annoItem.title}</span>
                          </div>
                          <div className="news-date">
                            <h5 className="date-text">
                              {" "}
                              {format(
                                parse(
                                  annoItem.dateposted,
                                  "yyyy-MM-dd'T'HH:mm:ss.SSSXXX",
                                  new Date()
                                ),
                                "MMMM dd, yyyy"
                              )}
                            </h5>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="swiper-pagination"></div>
            <div className="swiper-button-next"></div>
            <div className="swiper-button-prev"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AnnoCarousel;
