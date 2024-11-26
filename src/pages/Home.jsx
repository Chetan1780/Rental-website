import React, { useEffect, useState } from "react";
import Layout from "../layout/Layout";
import HeroSection from "@/layout/HeroSection";
import DisplayCar from "@/components/caar/DisplayCar";
import { Separator } from "@/components/ui/separator";

const Home = () => {

  // Fetch cars data when component is mounted
  

  return (
    <Layout>
      <HeroSection/>
      <Separator classname="my-10" />
      {/* Featured Cars */}
      <DisplayCar/> 
      <Separator classname="my-12" />
      <div className="h-10"></div>
      {/* Call to Action */}
      
    </Layout>
  );
};

export default Home;
