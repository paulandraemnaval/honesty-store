import placeholderImage from "@public/defaultImages/placeholder_image.png";
import Image from "next/image";
import ButtonLoading from "./ButtonLoading";

const DashboardCard = ({
  icon = null,
  label = "",
  data = "",
  formatData = (data) => {
    return data;
  },
  loading = false,
}) => {
  return (
    <div className="flex sm:flex-row flex-col bg-mainButtonColor px-4 py-4 rounded-lg shadow-lg flex-1 border border-gray-700 h-full text-white">
      <div className="flex w-full items-center">
        {/* Image Section */}
        <div className="w-8 h-8 sm:w-16 sm:h-16 flex-shrink-0">
          <Image
            src={icon || placeholderImage}
            layout="responsive"
            width={70}
            height={70}
            alt="card_icon"
            className="object-contain"
          />
        </div>

        {/* Label Section */}
        <div className="flex flex-col mr-auto text-left px-2">
          <p className="sm:text-lg text-sm font-semibold mt-auto mb-auto items-center flex ">
            {label}
          </p>
        </div>
      </div>

      {/* Data Section */}
      <div className="flex items-center sm:justify-center flex-1">
        <p className="sm:text-3xl text-xl font-bold sm:items-center">
          {loading ? <ButtonLoading size="l" /> : data ? formatData(data) : ""}
        </p>
      </div>
    </div>
  );
};

export default DashboardCard;
