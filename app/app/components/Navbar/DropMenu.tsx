import Link from "next/link";
import React from "react";
import EditProfile from "@/app/profile/[slug]/page";

type DropMenuProps = {
  isOpen: boolean;
};

function DropMenu({ isOpen }: DropMenuProps) {
  return (
    <>
      {isOpen && (
        <div className="absolute top-0 bg-white shadow-xl right-0 flex flex-col justify-center items-start w-60 rounded-xl transition-all duration-200 ease-in-out text-[1rem] font-normal">
          <Link
            href={"./profile/"}
            className="hover:bg-teal-600 hover:text-white p-4 w-full rounded-t-xl transition-colors duration-200 ease-in-out"
          >
            YOUR <span className="font-bold">PROFILE</span>
          </Link>
          <Link
            href={"./"}
            className="hover:bg-teal-600 hover:text-white p-4 w-full transition-colors duration-200 ease-in-out"
          >
            REQUESTS
          </Link>
          <Link
            href={"./"}
            className="hover:bg-teal-600 hover:text-white p-4 w-full rounded-b-xl transition-colors duration-200 ease-in-out"
          >
            SETTINGS
          </Link>
        </div>
      )}
    </>
  );
}

export default DropMenu;
