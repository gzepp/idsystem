import React, { useEffect, useState } from "react";
import { PrintHeader, PrintFooter } from "../../components";
import "./admin_css/admin_staff_rec.css";
import "./adminpages.css";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";

export default function Tester() {
  const [contactNo, setContactNo] = useState();

  const handlephoneChange = (value) => {
    console.log(contactNo);
    setContactNo(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(contactNo);
  };
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <div className="printer-body-container">
          <PhoneInput
            name="contactNo"
            placeholder="Enter phone number"
            maxLength="10"
            value={contactNo}
            onChange={handlephoneChange}
          />
        </div>
        <button type="submit"> TEST ahahshadasdos</button>
      </div>
    </form>
  );
}
