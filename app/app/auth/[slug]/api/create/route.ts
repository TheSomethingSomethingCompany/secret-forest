import prisma from "../../../../lib/prisma";
import { NextRequest } from "next/server";
import { HmacSHA256 } from "crypto-js";

export async function POST(request: NextRequest) {
  const requestJson = await request.json();
  const { name, username, email, password } = requestJson;
  const result = await prisma.member.create({
    data: {
      name,
      username,
      email: JSON.stringify(
        HmacSHA256(email, "6b209cdb-07c1-4fc9-aea4-42057f04aa8c")
      ),
      password: JSON.stringify(
        HmacSHA256(password, "6b209cdb-07c1-4fc9-aea4-42057f04aa8c")
      ),
      isorganization: false,
    },
  });
  return new Response(JSON.stringify(result), { status: 201 });
}
