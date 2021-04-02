import React from "react";
import { render, waitFor } from "@testing-library/react";
import nock from "nock";
import { QueryClient, QueryClientProvider } from "react-query";
import List from "../List";

console.log({ waitFor });

const queryClient = new QueryClient();

describe("AccountList", () => {
  process.env.REACT_APP_MYEXPENSES_TS_API = "mocked.server.org";

  // not working
  nock("mocked.server.org")
    .get("/accounts")
    .reply(200, {
      data: {
        id: 1,
        name: "account name",
        balance: 1000,
      },
    });

  test("renders list", async () => {
    const { queryByTestId } = render(
      <QueryClientProvider client={queryClient}>
        <List />
      </QueryClientProvider>
    );
    await waitFor(() => {
      const accountRow = queryByTestId("account-row-1");
      expect(accountRow).toBeInTheDocument();
    });
  });
});
