"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <section className="">
      <div className="flex justify-between items-center px-4 min-[600]:px-6 h-12">
        <Image
          src="/brand_logo_dark.png"
          alt="AuExch Logo"
          width={152}
          height={1000}
          className="object-contain h-13 min-[600]:mx-2 mx-1"
        />
        <h1 className="text-sm font-bold">Need help?</h1>
      </div>
      <div className="flex flex-col max-[900]:pt-12 pb-4 min-[900]:flex-row w-full flex-1 basis-auto min-[900]:h-[calc(100vh-50px)]">
        {/* LEFT SIDE */}
        <div
          className="hidden min-[900]:flex flex-col gap-16 justify-center items-center w-120 h-full px-6 pt-18 pb-6 bg-no-repeat bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(0deg, rgba(20 26 33 / 92%), rgba(20 26 33 / 92%)), url('https://auexch.com/assets/background/background-3-blur.webp')`,
          }}
        >
          <h2 className="text-[32px] font-semibold">Hi, Welcome back</h2>
          <Image
            src="/brand_logo_dark.png"
            alt="AuExch Logo"
            width={304}
            height={1000}
            className="object-contain aspect-4/3"
          />
        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-col justify-center px-8 md:px-16 lg:px-24 text-white flex-1 basis-auto">
          <div className="mx-4 mt-12 md:mx-auto md:w-md xl:w-105">
            <form className="space-y-5">
              {/* Heading */}
              <h2 className="text-xl xl:text-[19px] font-semibold">
                Sign in to AuExch
              </h2>
              <p className="text-sm  text-white">
                Don’t have an account?{" "}
                <Link href="/signup" className="">
                  Get started
                </Link>
              </p>

              {/* Username */}
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder=" "
                  className="peer w-full rounded-[8px] border border-[#373E45] px-4 py-3 text-sm bg-[#11141a] text-white outline-none focus:border-[#078DEE]"
                />
                <label className="absolute left-3 top-3 text-sm text-[#637381] peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-white bg-[#1F252C] px-1 transition-all">
                  Username *
                </label>
              </div>

              {/* Password */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder=" "
                  className="peer w-full rounded-[8px] border border-[#373E45] px-4 py-3 text-sm bg-[#11141a] text-white outline-none focus:border-[#078DEE]"
                />
                <label className="absolute left-3 top-3 text-sm text-[#637381] peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-white px-1 transition-all">
                  Password *
                </label>

                {/* Toggle */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-white"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              {/* Login Button */}
              <button
                disabled={!password}
                className={`w-full rounded-[8px] py-3 text-sm font-semibold transition-all ${
                  password
                    ? "bg-[#078DEE] text-white"
                    : "bg-[rgba(145,158,171,0.24)] text-[rgba(145,158,171,0.8)] cursor-not-allowed"
                }`}
              >
                Login
              </button>

              {/* Go to Home */}
              <Link href="/">
                <button
                  type="button"
                  className="w-full rounded-[8px] py-3 font-semibold bg-white text-[#212B36]"
                >
                  Go to Home
                </button>
              </Link>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
