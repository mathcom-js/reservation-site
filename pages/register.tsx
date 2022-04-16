import { useState } from "react";
import Button from "../components/Button";
import Header from "../components/Header";

export default function Register() {
  return (
    <>
      <Header />
      <form>
        <div className="max-w-xl w-full flex flex-col mx-auto mt-20 space-y-8">
          <h1 className="text-center text-lg text-violet-400">
            Register Your Shop
          </h1>
          <div className="flex flex-col space-y-2">
            <span className="text-xs">Your Shop</span>
            <input
              className="focus:outline-none focus:border-violet-400 border-2 border-gray-200 rounded-md pl-1.5"
              type="text"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <span className="text-xs">Your Time</span>
            <div className="flex w-full justify-between">
              <input
                className="focus:outline-none focus:border-violet-400 border-2 border-gray-200 rounded-md pl-1.5"
                type="datetime-local"
              />
              <span>-</span>
              <input
                className="focus:outline-none focus:border-violet-400 border-2 border-gray-200 rounded-md pl-1.5"
                type="datetime-local"
              />
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <span className="text-xs">Your Shop Description</span>
            <input
              className="focus:outline-none focus:border-violet-400 border-2 border-gray-200 rounded-md pl-1.5"
              type="text"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <span className="text-xs">Your Shop Image</span>
            <label className="border-2 flex justify-center items-center rounded-md cursor-pointer text-violet-300 border-violet-200 border-md h-48">
              <svg
                className="w-12 h-12"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <input type="file" className="hidden" />
            </label>
          </div>

          <Button text="Register" />
        </div>
      </form>
    </>
  );
}
