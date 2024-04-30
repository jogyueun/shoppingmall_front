import { useEffect, useState } from "react";
import axios from "axios";
import baseApiUrl from "../constants/apiUrl";

export default function SignUp() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    axios
      .get(`${baseApiUrl}/apis/1/sign_in`)
      .then((response) => {
        setData(response.data);
        setIsLoading(true);
      })
      .catch(console.error);

    // (async () => {
    //   const response = await axios.get(`${baseApiUrl}/apis/1/sign_in`);
    //   setData(response.data);
    //   setIsLoading(true);
    // })();
  }, [setData, setIsLoading]);

  return (
    <>
      <div
        style={{
          width: "700px",
          padding: "20px",
        }}
      >
        <h1>로그인</h1>
        <input type="email" />
        <input type="password" />
        <button>로그인</button>
      </div>
    </>
  );
}
