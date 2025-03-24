import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import ListingItem from "../components/ListingItem";

const Home = () => {
  const API_BASE_URL = import.meta.env.BACKEND_URL_DEPLOYED_VERCEL;
  SwiperCore.use([Navigation]);
  const [offerListing, setOfferListing] = useState([]);
  const [rentListing, setRentListing] = useState([]);
  const [saleListing, setSaleListing] = useState([]);
  console.log(saleListing);
  console.log('home is rendered final');

  useEffect(() => {

    const fetchOfferListing = async () => {
      try {
        console.log("entered in try of offer final");
        const response = await fetch(`https://mern-estate-backend-delta.vercel.app/listing/get?type=all&limit=4`, {
          method: "GET"
        });
        const jsonData = await response.json();
        setOfferListing(jsonData);
        console.log(jsonData);
        fetchRentListing();
      } catch (e) {
        console.log(e);
        console.log("entered in catch of offer final:  "+e);
      }
    };
    fetchOfferListing();

    const fetchRentListing = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/listing/get?type=rent&limit=4`);
        const jsonData = await response.json();
        setRentListing(jsonData);
        fetchSaleListing();
      } catch (e) {
        console.log(e);
      }
    };

    const fetchSaleListing = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/listing/get?type=sale&limit=4`);
        const jsonData = await response.json();
        setSaleListing(jsonData);
      } catch (e) {
        console.log(e);
      }
    };
  }, []);

  return (
    <div>
      {/* */}

      <div className="flex flex-col gap-6 py-28 px-6 max-w-6xl mx-auto">
        <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">
          Find your next <span className="text-slate-500">perfect</span>
          <br />
          place with ease
        </h1>
        <div className="text-gray-400 text-xs sm:text-sm ">
          Sahand Estate is the best place for your next perfect place to live
          <br />
          We have a wide range of properties for you to choose from.
        </div>
        <Link
          className="text-blue-800 font-bold hover:underline 
        text-xs sm:text-sm"
          to={"/search"}
        >
          Let's get started...
        </Link>
      </div>

      {/* */}
      <Swiper navigation>
        {offerListing &&
          offerListing.length > 0 &&
          offerListing.map((listing, index) => (
            <SwiperSlide key={index}>
              <img
                src={listing.imagesUrls[0]}
                alt={`Slide ${index}`}
                className="w-full h-[450px] object-cover"
              />
            </SwiperSlide>
          ))}
      </Swiper>
      {/* */}

      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {offerListing && offerListing.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent Offers
              </h2>
              <Link
                className="text-blue-800 hover:underline text-sm"
                to={"/search?offer=true"}
              >
                Show more offers
              </Link>
            </div>
            <div className=" flex flex-wrap gap-4">
              {offerListing.map((listing) => (
                <ListingItem listing={listing} key={listing._id}></ListingItem>
              ))}
            </div>
          </div>
        )}

        {rentListing && rentListing.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent places for rent
              </h2>
              <Link
                className="text-blue-800 hover:underline text-sm"
                to={"/search?type=rent"}
              >
                Show more places for rent
              </Link>
            </div>
            <div className=" flex flex-wrap gap-4">
              {rentListing.map((listing) => (
                <ListingItem listing={listing} key={listing._id}></ListingItem>
              ))}
            </div>
          </div>
        )}

        {saleListing && saleListing.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent places for sale
              </h2>
              <Link
                className="text-blue-800 hover:underline text-sm"
                to={"/search?type=sale"}
              >
                Show more places for sale
              </Link>
            </div>
            <div className=" flex flex-wrap gap-4">
              {saleListing.map((listing) => (
                <ListingItem listing={listing} key={listing._id}></ListingItem>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
