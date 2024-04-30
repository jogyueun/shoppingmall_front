import { useEffect, useState } from "react";
import axios from "axios";
import baseApiUrl from "../constants/apiUrl";
import styles from "../pages/css/mypage.module.css";
import { Link } from "react-router-dom";

const Mypage = () => {
  return (
    <div class="container" style={{marginTop: '0'}}>
      <div>
        <nav>
          <ul></ul>
          <ul>
            <li className={styles.nav_li}>
              <Link to={"/myPage"} className={styles.nav_li}>
                회원정보
              </Link>
              |
              <Link to={"/user/order"} className={styles.nav_li}>
                주문조회
              </Link>
              |
              <Link to={"/cart"} className={styles.nav_li}>
                장바구니
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Mypage;
