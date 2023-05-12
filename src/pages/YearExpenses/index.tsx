import { useMemo } from "react";
import moment, { Moment } from "moment";
import keyBy from "lodash/keyBy";
import slice from "lodash/slice";
import sum from "lodash/sum";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";
import PrivatePage from "components/PrivatePage";
import useCategoriesQuery from "queries/categories";
import useMonthExpenseQuery from "hooks/useMonthExpenseQuery";
import currency from "helpers/currency";

const useStyles = makeStyles(() => ({
  chartContainer: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
  },
}));

const last11Month = moment().subtract(11, "month");
const last10Month = moment().subtract(10, "month");
const last9Month = moment().subtract(9, "month");
const last8Month = moment().subtract(8, "month");
const last7Month = moment().subtract(7, "month");
const last6Month = moment().subtract(6, "month");
const last5Month = moment().subtract(5, "month");
const last4Month = moment().subtract(4, "month");
const last3Month = moment().subtract(3, "month");
const last2Month = moment().subtract(2, "month");
const lastMonth = moment().subtract(1, "month");
const currentMonth = moment();

function useMonthCategoryQuery(month: Moment) {
  const label = month.format("MMM");
  const data = useMonthExpenseQuery(month);

  return {
    label,
    data: keyBy(data.data, "categoryName"),
  };
}

function YearExpenses() {
  const classes = useStyles();
  const { query: categoriesQuery } = useCategoriesQuery();

  // TODO: need to find a better implementation
  const last11MonthData = useMonthCategoryQuery(last11Month);
  const last10MonthData = useMonthCategoryQuery(last10Month);
  const last9MonthData = useMonthCategoryQuery(last9Month);
  const last8MonthData = useMonthCategoryQuery(last8Month);
  const last7MonthData = useMonthCategoryQuery(last7Month);
  const last6MonthData = useMonthCategoryQuery(last6Month);
  const last5MonthData = useMonthCategoryQuery(last5Month);
  const last4MonthData = useMonthCategoryQuery(last4Month);
  const last3MonthData = useMonthCategoryQuery(last3Month);
  const last2MonthData = useMonthCategoryQuery(last2Month);
  const lastMonthData = useMonthCategoryQuery(lastMonth);
  const currentMonthData = useMonthCategoryQuery(currentMonth);

  const monthData = useMemo(
    () => [
      last11MonthData,
      last10MonthData,
      last9MonthData,
      last8MonthData,
      last7MonthData,
      last6MonthData,
      last5MonthData,
      last4MonthData,
      last3MonthData,
      last2MonthData,
      lastMonthData,
      currentMonthData,
    ],
    [
      last11MonthData,
      last10MonthData,
      last9MonthData,
      last8MonthData,
      last7MonthData,
      last6MonthData,
      last5MonthData,
      last4MonthData,
      last3MonthData,
      last2MonthData,
      lastMonthData,
      currentMonthData,
    ]
  );

  const categoriesChartData = useMemo(() => {
    if (!categoriesQuery.data) return [];

    const categories = categoriesQuery.data
      .filter((cat) => cat.display_in_month_expense)
      .map((cat) => cat.name);

    return categories.map((cat) => {
      const average =
        sum(monthData.map(({ data }) => data[cat].value)) / monthData.length;

      function last3MonthsAverage(index: number) {
        const last3MonthsData = slice(
          monthData,
          Math.max(index - 2, 0),
          index + 1
        );

        return (
          sum(last3MonthsData.map(({ data }) => data[cat].value)) /
          last3MonthsData.length
        );
      }

      return {
        name: cat,
        chartData: monthData.map((month, index) => ({
          month: month.label,
          forecast: month.data[cat].forecast,
          value: month.data[cat].value,
          average,
          last3Months: last3MonthsAverage(index),
        })),
      };
    });
  }, [categoriesQuery.data, monthData]);

  return (
    <PrivatePage title="Year Expenses">
      <div className={classes.chartContainer}>
        {categoriesChartData.map((cat) => (
          <div key={cat.name}>
            <Typography>{cat.name}</Typography>
            <LineChart
              width={500}
              height={180}
              data={cat.chartData}
              margin={{
                top: 25,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <XAxis dataKey="month" />
              <YAxis
                tickFormatter={currency.format}
                domain={[
                  (dataMin: number) => Math.max(dataMin - 10000, 0),
                  "dataMax + 10000",
                ]}
              />
              <Tooltip formatter={currency.format} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#1976D2"
                dot={false}
              />
              <Line
                type="step"
                dataKey="forecast"
                stroke="#388E3C"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="average"
                stroke="#F44336"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="last3Months"
                stroke="#FF5722"
                dot={false}
              />
            </LineChart>
          </div>
        ))}
      </div>
    </PrivatePage>
  );
}

export default YearExpenses;
