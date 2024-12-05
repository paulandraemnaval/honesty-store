"use client";
import { LineChart, BarChart } from "@mui/x-charts";
import Image from "next/image";
import profitIcon from "@public/icons/profit_icon.png";
import productsIcon from "@public/icons/products_icon2.png";
import DashboardCard from "@components/DashboardCard";
import revenueIcon from "@public/icons/revenue_icon.png";
import supplierIcon from "@public/icons/supplier_icon.png";
const userPage = () => {
  const chartHeight = 280; // Define a consistent height for both charts

  return (
    <div className="w-full px-4 py-2 flex flex-col sm:h-[calc(100vh-6rem)] h-[calc(100vh-10rem)] mt-2 z-0">
      {/* Header Section */}
      <div className="px-4">
        <span className="flex gap-2 items-center mb-2">
          <span className="flex flex-col justify-evenly">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <span className="text-sm">Overview of your data</span>
          </span>
        </span>
        <div className="w-full border mb-2"></div>
      </div>

      {/* Main Content Section */}
      <div className="overflow-y-auto flex-1 p-4">
        {/* Cards Section */}
        <div className="flex justify-evenly gap-4 mb-4">
          <DashboardCard icon={revenueIcon} label="Total Revenue" data="200k" />
          <DashboardCard icon={productsIcon} label="Total Products" data="50" />
          <DashboardCard
            icon={supplierIcon}
            label="Total Suppliers"
            data="10"
          />
        </div>

        {/* Charts Section */}
        <div className="flex gap-4 rounded-md shadow-md border border-gray-700 p-4">
          {/* Line Chart */}
          <div className="flex flex-col p-4 rounded-lg shadow-lg border border-gray-700 flex-1">
            <p className="text-xl font-semibold mb-4">Revenue</p>
            <LineChart
              xAxis={[{ data: [1, 2, 3, 4, 5], label: "X-Axis Label" }]}
              yAxis={[{ label: "Y-Axis Label" }]}
              series={[{ data: [1, 2, 3, 4, 5], color: "#4285F4" }]}
              height={chartHeight} // Use the same height
              title="Line Chart"
              margin={{ left: 60, right: 60, top: 30, bottom: 60 }}
              grid={{ vertical: true, horizontal: true }}
            />
          </div>

          {/* Bar Chart */}
          <div className="flex flex-col p-4 rounded-lg shadow-lg border border-gray-700 flex-1">
            <p className="text-xl font-semibold mb-2">Bar Chart Example</p>
            <BarChart
              xAxis={[
                {
                  scaleType: "band",
                  data: ["A", "B", "C", "D", "E"],
                  label: "Categories",
                },
              ]}
              series={[{ data: [10, 20, 30, 40, 50], color: "#4285F4" }]}
              height={chartHeight} // Use the same height
              margin={{ left: 60, right: 60, top: 30, bottom: 60 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default userPage;
