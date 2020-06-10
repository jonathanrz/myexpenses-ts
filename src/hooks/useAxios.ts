import { useMemo } from "react";
import axios from "axios";
import Cookie from "js-cookie";

function useAxios() {
  const user = Cookie.get("user");

  return useMemo(() => {
    const userData = JSON.parse(user || "");

    return axios.create({
      baseURL: process.env.REACT_APP_MYEXPENSES_TS_API,
      headers: { Authorization: `Bearer ${userData && userData.token}` },
    });
  }, [user]);
}

export default useAxios;
