"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import fetchUserData from "../api/fetchUserData";
import MemberFetch from "@/app/types/MemberFetch";

function EditProfile({ params }: { params: { slug: string } }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");

  const router = useRouter();
  useEffect(() => {
    const memberData = fetchData();
    console.log("EFF DAT:\n" + JSON.stringify(memberData));
  });

  const fetchData = async (): Promise<MemberFetch> => {
    return await fetchUserData({ ...params });
  };

  return (
    <section>
      <button
        onClick={() => {
          fetchData();
        }}
      >
        Click
      </button>
    </section>
  );
}

export default EditProfile;
