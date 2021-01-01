import React from "react";
import PrivatePage from "components/PrivatePage";
import Accounts from "./Accounts";

function Home() {
  return (
    <PrivatePage title="Home">
      <Accounts />
    </PrivatePage>
  );
}

export default Home;
