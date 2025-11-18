"use client";
import React, { useEffect } from "react";

const page = () => {
  useEffect(() => {
    window.location.href = "/home";
  }, []);
  return <div>page</div>;
};

export default page;
