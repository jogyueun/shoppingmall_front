import React, { useState } from "react";
import { useDaumPostcodePopup } from "react-daum-postcode";
import styles from "./css/Postcode.module.css";

const Postcode = ({ onComplete }) => {
  const scriptUrl = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
  const open = useDaumPostcodePopup(scriptUrl);

  const handleComplete = (data) => {
    let fullAddress = data.address;
    let extraAddress = "";

    if (data.addressType === "R") {
      if (data.bname !== "") {
        extraAddress += data.bname;
      }
      if (data.buildingName !== "") {
        extraAddress +=
          extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
    }

    onComplete({ fullAddress, zonecode: data.zonecode });
  };

  const handleClick = () => {
    open({ onComplete: handleComplete });
  };

  return (
    <button type="button" onClick={handleClick} className={styles.button}>
      주소 찾기
    </button>
  );
};

export default Postcode;
