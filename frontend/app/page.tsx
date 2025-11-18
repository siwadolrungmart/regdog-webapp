"use client";
import React, { useEffect } from "react";

const page = () => {
  useEffect(() => {
    window.location.href = "/login";
  }, []);
  return <div>page</div>;
};

export default page;
