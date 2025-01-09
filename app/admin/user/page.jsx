"use client";
import { LineChart, BarChart } from "@mui/x-charts";
import profitIcon from "@public/icons/profit_icon.png";
import productsIcon from "@public/icons/products_icon2.png";
import DashboardCard from "@components/DashboardCard";
import revenueIcon from "@public/icons/revenue_icon.png";
import supplierIcon from "@public/icons/supplier_icon.png";
import ButtonLoading from "@components/ButtonLoading";
import { useEffect, useState, useRef } from "react";
import { toast } from "react-hot-toast";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const userPage = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const hasFetchedData = useRef(false); // Prevent multiple API calls

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/dashboard", {
        headers: {
          "Cache-Control": "no-store",
        },
        next: {
          revalidate: 0,
        },
      });
      if (response.ok) {
        const jsonData = await response.json();
        setData(jsonData?.data || null);
      } else {
        toast.error("Failed to fetch dashboard data", {
          duration: 3000,
          style: {
            fontSize: "1.2rem",
            padding: "16px",
          },
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!hasFetchedData.current) {
      hasFetchedData.current = true; // Ensure it's called only once
      fetchDashboardData();
    }
  }, []);

  const chartHeight = 250;

  const formatRevenue = (data) => {
    if (data > 1000) {
      return `₱${(data / 1000).toFixed(2)}K`;
    }
    return `₱${data}`;
  };

  return (
    <div className="w-full px-4 py-2 flex flex-col sm:h-[calc(100vh-7rem)] h-[calc(100vh-10rem)] mt-2 z-0 custom-scrollbar">
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

      <div className="overflow-x-auto overflow-y-auto flex-1 px-4 py-1 custom-scrollbar">
        <div className="grid grid-cols-2 sm:grid-cols-2 sm:gap-x-4 sm:gap-y-2 gap-2 mb-2">
          <DashboardCard
            icon={revenueIcon}
            label="Total Sales"
            data={parseFloat(data?.totalSales)}
            formatData={formatRevenue}
            loading={loading}
          />
          <DashboardCard
            icon={profitIcon}
            label="Total Profit"
            data={parseFloat(data?.totalProfit)}
            formatData={formatRevenue}
            loading={loading}
          />

          <DashboardCard
            icon={productsIcon}
            label="Total Products"
            data={data?.products}
            loading={loading}
          />
          <DashboardCard
            icon={supplierIcon}
            label="Total Suppliers"
            data={data?.suppliers}
            loading={loading}
          />
        </div>
        {/* Charts Section */}
        <div className="flex sm:flex-row flex-col gap-4">
          {/* Line Chart */}
          <div className="flex flex-col p-2 rounded-lg shadow-lg border border-gray-700 flex-1 ">
            <p className="text-xl font-semibold mb-4">Profit</p>
            {loading ? (
              <div className="flex justify-center items-center h-[250px]">
                <ButtonLoading size="l" color="mainButtonColor" />
              </div>
            ) : (
              <LineChart
                xAxis={[
                  {
                    scaleType: "band",
                    data:
                      data?.profit?.map((item) =>
                        new Date(item.date.start).toLocaleDateString()
                      ) || [],
                    label: "Date",
                  },
                ]}
                series={[
                  {
                    data: data?.profit?.map((item) => item.total) || [],
                    color: "#4285F4",
                  },
                ]}
                height={chartHeight}
                margin={{ left: 40, right: 40, top: 10, bottom: 50 }}
              />
            )}
          </div>

          {/* Bar Chart */}
          <div className="flex flex-col p-2 rounded-lg shadow-lg border border-gray-700 flex-1 ">
            <p className="text-xl font-semibold mb-2">Sales</p>
            {loading ? (
              <div className="flex justify-center items-center h-[250px]">
                <ButtonLoading size="l" color="mainButtonColor" />
              </div>
            ) : (
              <BarChart
                xAxis={[
                  {
                    scaleType: "band",
                    data:
                      data?.sales.map((item) =>
                        new Date(item.date.start).toLocaleDateString()
                      ) || [],
                    label: "Date",
                  },
                ]}
                series={[
                  {
                    data: data?.sales.map((item) => item.total) || [],
                    color: "#4285F4",
                  },
                ]}
                height={chartHeight}
                margin={{ left: 40, right: 40, top: 10, bottom: 50 }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default userPage;
