"use client";
import Link from "next/link";
import React from "react";
// import backGroundVideo from './image&Videos/bg-video.mp4';;

const HeroSection = () => {
  return (
    <div className="relative">
      <div className="relative h-screen w-full overflow-hidden pt-16">
        <video
          autoPlay
          loop
          muted
          className="absolute top-0 left-0 w-full h-full object-cover opacity-30 z-20  "
          src="/video/bg-video.mp4"
        >
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-black z-10"></div>
        <div className="relative z-20 flex flex-col items-center justify-center h-full text-white text-center px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 animate-[fadeInDown_1s_ease-out]">
            Welcome to Mern kart
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl animate-[fadeInUp_1s_ease-out_0.3s] animate-fill-both">
            Discover the best shopping experience with our curated collection of
            products.
          </p>
          <Link
            href="/Products"
            className="px-8 py-3 bg-yellow-500 text-gray-900 font-semibold rounded-lg hover:bg-yellow-600 transition duration-300 animate-pulse"
          >
            Shop Now
          </Link>
        </div>
      </div>
      <section className="container mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Choose mern kart?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
            <h3 className="text-xl font-semibold mb-4">Quality Products</h3>
            <p className="text-gray-600">
              We offer only the best products with guaranteed quality and
              satisfaction.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
            <h3 className="text-xl font-semibold mb-4">Fast Delivery</h3>
            <p className="text-gray-600">
              Get your orders delivered quickly with our efficient logistics.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
            <h3 className="text-xl font-semibold mb-4">24/7 Support</h3>
            <p className="text-gray-600">
              Our team is here to assist you anytime, anywhere.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroSection;
