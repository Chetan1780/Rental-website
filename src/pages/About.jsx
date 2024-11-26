import React from "react";

const About = () => {
  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 text-gray-800">
      <div className="container mx-auto px-6 py-12 lg:py-20 max-w-7xl">
        {/* Header Section */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            About Rentify
          </h1>
          <p className="mt-4 text-lg text-gray-600 sm:text-xl max-w-3xl mx-auto">
            Your trusted partner for seamless car rentals, offering exceptional service and a wide range of vehicles to meet all your travel needs.
          </p>
        </div>

        {/* Mission and Values */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12 lg:mt-20">
          {/* Left Section */}
          <div className="flex flex-col justify-center space-y-6">
            <h2 className="text-3xl font-semibold text-gray-900">
              Our Mission
            </h2>
            <p className="text-lg text-gray-600">
              At Rentify, our mission is to simplify the car rental process by offering an extensive selection of vehicles, unbeatable prices, and outstanding customer service. We aim to make your journey enjoyable and stress-free, whether you're planning a road trip, business travel, or need a reliable car for daily use.
            </p>
            <h2 className="text-3xl font-semibold text-gray-900 mt-6">
              Why Choose Us?
            </h2>
            <ul className="list-disc text-lg text-gray-600 pl-6 space-y-2">
              <li>Extensive range of vehicles for all budgets and needs.</li>
              <li>Transparent pricing with no hidden fees.</li>
              <li>Convenient pick-up and drop-off options.</li>
              <li>24/7 customer support for a hassle-free experience.</li>
            </ul>
          </div>

          {/* Right Section */}
          <div className="relative">
            <img
              src="/images/pexels-trace-707046.jpg"
              alt="About CarCraze"
              className="w-full h-full object-cover rounded-xl shadow-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent rounded-xl"></div>
            <div className="absolute bottom-6 left-6 text-white">
              <h3 className="text-2xl font-bold">
                Reliable Cars, Exceptional Service
              </h3>
              <p className="mt-2 text-lg">
                We’re here to redefine your car rental experience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
