import React from "react";
import useAxios from "../../hooks/useAxios";
import useAsync from "../../hooks/useAsync";
import PrivatePage from "../../components/PrivatePage";

function Accounts() {
  const axios = useAxios();
  const data = useAsync(() => {
    return axios.get("accounts").then(({ data }) => data.data);
  });

  return <PrivatePage title="Accounts">Accounts</PrivatePage>;
}

export default Accounts;
