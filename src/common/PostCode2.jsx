import React, { useState, useEffect } from "react";
import styles from '../pages/css/userOrderConfirm.module.css'
const PostCode2 = ({ onAddressSelected }) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    //script.onload = () => console.log('카카오 우편번호 서비스 로드 완료');
    document.head.appendChild(script);

    return () => document.head.removeChild(script);
  }, []);

  const openPostcode = () => {
    new window.daum.Postcode({
      oncomplete: function(data) {
        onAddressSelected(data.zonecode, data.address);
      }
    }).open();
  };

  return (
    <button type="button" onClick={openPostcode} 
            className={styles.postButton}>우편번호 찾기</button>
  );
};

export default PostCode2;
