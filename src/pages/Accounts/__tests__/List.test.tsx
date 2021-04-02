import React from "react";
import { render, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import useAccountsQuery from "queriesMocked/accounts";
import { AccountsList } from "../List";

const queryClient = new QueryClient();

function MockedAccountsLists() {
  const accountsQuery = useAccountsQuery({
    accounts: [
      {
        id: "1",
        name: "account name",
        balance: 1000,
      },
    ],
  });

  return <AccountsList accountQuery={accountsQuery} />;
}

describe("AccountList", () => {
  test("renders list", async () => {
    const { getByTestId } = render(
      <QueryClientProvider client={queryClient}>
        <MockedAccountsLists />
      </QueryClientProvider>
    );

    await waitFor(() => {
      const accountRow = getByTestId("account-row-1");
      expect(accountRow).toBeInTheDocument();

      expect(getByTestId("account-name")).toHaveTextContent("account name");
      expect(getByTestId("account-balance")).toHaveTextContent("$10.00");
    });
  });
});
