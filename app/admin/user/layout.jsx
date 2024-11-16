import HeaderBar from "@components/HeaderBar";
import Navbar from "../../../components/Navbar";
const userLayout = ({ children }) => {
  return (
    <div className="flex min-h-[100vh]">
      <Navbar />
      <div className="flex flex-1 flex-col">
        <HeaderBar />
        <div className="bg-backgroundMain h-full">{children}</div>
      </div>
    </div>
  );
};

export default userLayout;
