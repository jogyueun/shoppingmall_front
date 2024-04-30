import React, { useEffect, useState } from "react";
import axios from "axios";
import baseApiUrl from "../constants/apiUrl";
import { Link } from "react-router-dom";
import styles from "./css/AllUser.module.css";

const AllUser = () => {
  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(false);

  const toggleSelectedStatus = () =>
    setSelectedStatus((prevSelectedStatus) => !prevSelectedStatus);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const JWTToken = localStorage.getItem("jwtToken");
        const config = {
          headers: {
            Authorization: JWTToken,
          },
        };
        const response = await axios.get(baseApiUrl + "/api/admin/showAllUser", config);
        const data = response.data;
        setUsers(data); // 데이터는 response.data 안에 들어있습니다.
        console.log(data);
        setError(null); // 에러를 초기화합니다.
      } catch (e) {
        setError(e);
        console.log(e);
        alert("접근 할 수 없는 사용자입니다.");
        window.location.href = "/";
      }
      setLoading(false); // 로딩 상태를 false로 변경하여 API 호출이 완료됨을 나타냅니다.
    };

    fetchUsers();
  }, [selectedStatus]);

  const ChangeStatus = async (userId, newStatus) => {
    setLoading(true);
    const Id = parseInt(userId);
    console.log(Id);
    console.log(newStatus);
    try {
      const JWTToken = localStorage.getItem("jwtToken");
      const config = {
        headers: {
          Authorization: JWTToken,
        },
      };
      const response = await axios.patch(
        baseApiUrl + "/api/admin/changeUserStatus",
        { id: Id, status: newStatus },
        config,
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
    setLoading(false); // 로딩 상태를 false로 변경하여 API 호출이 완료됨을 나타냅니다.
    toggleSelectedStatus();
  };

  return (
    <>
      <div className={styles.main_box}>
        <div className={styles.inner_head}>
          <div className={styles.userId}>번호</div>
          <div className={styles.username}>아이디</div>
          <div className={styles.name}>유저 이름</div>
          <div className={styles.userDate}>생성 날짜</div>
          <div className={styles.userStatus}>상태</div>
          <div className={styles.userPoint}>적립금</div>
        </div>
        <div className={styles.inner_body}>
          {users &&
            users.map((user) => (
              <div key={user.id} className={styles.user_list_box}>
                <div className={styles.user_num}>{user.id}</div>
                <div className={styles.user_username}>{user.username}</div>
                {user.role === "ROLE_USER" ? (
                  <>
                    <div className={styles.user_name}>{user.userProfileDTO.name}</div>
                    <div className={styles.user_date}>{user.createdAt.split("T")[0]}</div>
                    <select
                      aria-label="status"
                      name="status"
                      className={styles.user_status}
                      value={user.status}
                      onChange={(e) => ChangeStatus(user.id, e.target.value)}
                    >
                      <option selected disabled value="">
                        계정 상태 변경
                      </option>
                      <option value="ACTIVE">활성</option>
                      <option value="DEACTIVE">휴먼</option>
                      <option value="DELETED">삭제</option>
                    </select>
                    <div className={styles.user_point}>{user.userProfileDTO.point}</div>
                  </>
                ) : (
                  <div className={styles.admin_text}>어드민 계정 입니다.</div>
                )}
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default AllUser;
