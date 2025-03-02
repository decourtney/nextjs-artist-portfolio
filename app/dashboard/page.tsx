import React from "react";
import FilePicker from "./FilePicker";
import ListContainer from "../../ListContainer";

const DashboardPage = () => {
  return (
    <div className="w-full bg-background-100">
      <div className="w-3/4 mx-auto">
        <ListContainer />
        <FilePicker />
      </div>
    </div>
  );
};

export default DashboardPage;
