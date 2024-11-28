const ButtonLoading = ({ children, color = "white" }) => {
  return (
    <>
      <span
        className={` ${
          color === "mainButtonColor" ? "spinner-border-blue" : "spinner-border"
        } animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2`}
      ></span>
      {children}
    </>
  );
};

export default ButtonLoading;
