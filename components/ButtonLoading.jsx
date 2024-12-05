const ButtonLoading = ({ children, color = "white", size = "m" }) => {
  return (
    <>
      <span
        className={` ${
          color === "mainButtonColor" ? "spinner-border-blue" : "spinner-border"
        } animate-spin ${
          size === "s" ? "w-2 h-2" : size === "l" ? "w-10 h-10" : "w-5 h-5"
        } border-2 border-white border-t-transparent rounded-full mr-2`}
      ></span>
      {children}
    </>
  );
};

export default ButtonLoading;
