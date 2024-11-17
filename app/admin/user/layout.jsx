import HeaderBar from "@components/HeaderBar";
import Navbar from "../../../components/Navbar";

const UserLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      <Navbar />
      <div className="bg-backgroundMain flex-1">
        <HeaderBar />
        {children}
      </div>
    </div>
  );
};

export default UserLayout;
