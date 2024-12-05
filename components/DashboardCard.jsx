import placeholderImage from "@public/defaultImages/placeholder_image.png";
import Image from "next/image";
const DashboardCard = ({ icon = null, label = "", data = "" }) => {
  return (
    <div className="flex bg-mainButtonColor px-4 py-6 rounded-lg shadow-lg flex-1 border border-gray-700 h-full text-white">
      <Image src={icon || placeholderImage} height={70} width={70} />
      <div className="flex flex-col mr-auto text-left px-2">
        <p className="text-lg font-semibold mt-auto mb-auto items-center flex ">
          {label}
        </p>
      </div>
      <div className="flex items-center justify-center">
        <p className="text-3xl font-bold items-center">{data}</p>
      </div>
    </div>
  );
};

export default DashboardCard;
