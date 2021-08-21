import { useMemo } from "react";
import moment from "moment";
import keyBy from "lodash/keyBy";
import Typography from "@material-ui/core/Typography";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from "recharts";
import PrivatePage from "components/PrivatePage";
import useCategoriesQuery from "queries/categories";
import useMonthExpenseQuery from "hooks/useMonthExpenseQuery";

const lastMonth = moment().subtract(1, "month");
const currentMonth = moment();

const lastMonthString = lastMonth.format("MMM");
const currentMonthString = currentMonth.format("MMM");

function YearExpenses() {
  const { query: categoriesQuery } = useCategoriesQuery();

  // TODO: need to find a better implementation
  const lastMonthData = useMonthExpenseQuery(lastMonth);
  const currentMonthData = useMonthExpenseQuery(currentMonth);

  const categoriesChartData = useMemo(() => {
    if (!categoriesQuery.data || !lastMonthData.data || !currentMonthData.data)
      return [];

    const categories = categoriesQuery.data
      .filter((cat) => cat.display_in_month_expense)
      .map((cat) => cat.name);

    const lastMonthCategories = keyBy(lastMonthData.data, "categoryName");
    const currentMonthCategories = keyBy(currentMonthData.data, "categoryName");

    console.log({ categories, lastMonthCategories });

    return categories.map((cat) => ({
      name: cat,
      chartData: [
        {
          month: lastMonthString,
          forecast: lastMonthCategories[cat].forecast,
          value: lastMonthCategories[cat].value,
        },
        {
          month: currentMonthString,
          forecast: currentMonthCategories[cat].forecast,
          value: currentMonthCategories[cat].value,
        },
      ],
    }));
  }, [categoriesQuery.data, lastMonthData.data, currentMonthData.data]);

  console.log({ categoriesChartData });

  return (
    <PrivatePage title="Year Expenses">
      {categoriesChartData.map((cat) => (
        <div key={cat.name}>
          <Typography>{cat.name}</Typography>
          <LineChart
            width={500}
            height={200}
            data={cat.chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
            <Line type="monotone" dataKey="forecast" stroke="#82ca9d" />
          </LineChart>
        </div>
      ))}
    </PrivatePage>
  );
}

export default YearExpenses;
