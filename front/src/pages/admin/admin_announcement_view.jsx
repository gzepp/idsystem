import React, { useRef, useEffect, useState } from "react";
import { AdminSidebar, AdminTopbar } from "../../components";
import { Link, useParams } from "react-router-dom";
import { parse, format } from "date-fns";

import "./admin_css/admin_anno_view.css";

import AdminAnnoListSearch from "./admin_data/admin_component_sidesearch";

export default function AdminAnnouncementView() {
  //Announcement Data
  const { annoData } = useParams();
  const decodedAnnoData = JSON.parse(decodeURIComponent(annoData));

  return (
    <div className="admin-u-regpage">
      <div className="admin-sidebar">
        <AdminSidebar />
      </div>
      <div className="admin-a-reg-contents">
        <AdminTopbar pageName="Announcement" />
        <div className="admin-post-body">
          <div className="admin-annopost-contents">
            {/* Announcement Details Container */}
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
            <div className="anno-search-container">
              <AdminAnnoListSearch />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
