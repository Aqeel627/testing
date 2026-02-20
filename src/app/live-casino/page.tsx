import BreadCrumb from "@/components/common/bread-crumb";
import Casino from "@/components/pages/live-casino";
import React from "react";

const LiveCasinoRoute = () => {
  return (
    <>
      <BreadCrumb title={"Live Casino Games"} />
      <Casino hideHeading/>
    </>
  );
};

export default LiveCasinoRoute;
