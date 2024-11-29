import React, { useState, useEffect, useRef } from "react";

import AnnoCard from "./user_AnnoCard";

const AnnoCardGallery = ({
  annoData,
  currentPage,
  itemsPerPage,
  onUpdateTotalAnno,
}) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const slicedAnnoData = annoData.slice(startIndex, endIndex);

  const totalAnno = annoData.length;

  useEffect(() => {
    onUpdateTotalAnno(totalAnno);
  }, [totalAnno, onUpdateTotalAnno]);

  // Create an array of arrays, with each inner array containing 2 AnnoCard components
  const rows = [];
  for (let i = 0; i < slicedAnnoData.length; i += 2) {
    const row = slicedAnnoData.slice(i, i + 2);
    rows.push(row);
  }

  return (
    <div className="annocard-container-column">
      {rows.map((row, rowIndex) => (
        <div className="annocard-container-row" key={rowIndex}>
          {row.map((annoItem, cardIndex) => (
            <AnnoCard key={cardIndex} announcementData={annoItem} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default AnnoCardGallery;
