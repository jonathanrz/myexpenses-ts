import React, { ReactNode } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import useStickyHeader from "hooks/useStickyHeader";

export interface Header {
  id: string;
  name: string;
  number?: boolean;
}

interface TableStickyProps {
  headers: Header[];
  renderBody: () => ReactNode;
  size: "small" | "medium";
}

function TableSticky({ headers = [], renderBody, size }: TableStickyProps) {
  const { tableRef, isSticky } = useStickyHeader();

  console.log({ isSticky });

  const renderHeader = () => (
    <TableHead>
      <TableRow>
        {headers.map((item) => (
          <TableCell key={item.id} align={item.number ? "right" : "left"}>
            {item.name}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );

  return (
    <div>
      {isSticky && (
        <Table
          className="sticky"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
          }}
          size={size}
        >
          {renderHeader()}
        </Table>
      )}
      <Table ref={tableRef} size={size}>
        {renderHeader()}
        <TableBody>{renderBody()}</TableBody>
      </Table>
    </div>
  );
}

export default TableSticky;
