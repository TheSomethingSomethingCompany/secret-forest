import prisma from "../../../../lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { HmacSHA256 } from "crypto-js";
import { Prisma } from "@prisma/client";

export async function POST(request: NextRequest) {
  const requestJson: { identifier: string; password: string } =
    await request.json();
  try {
    const result: [
      {
        username: string;
      }
    ] = await prisma.$queryRaw`SELECT username FROM usign WHERE username = ${
      requestJson.identifier
    } AND password = ${JSON.stringify(
      HmacSHA256(requestJson.password, "6b209cdb-07c1-4fc9-aea4-42057f04aa8c")
    )}`;
    return new Response(JSON.stringify(result[0].username), { status: 201 });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        console.log(
          "There is a unique constraint violation, a new user cannot be created with this email"
        );
        return new Response(
          "There is a unique constraint violation, a new user cannot be created with this email",
          { status: 404 }
        );
      }
      return new Response(JSON.stringify(e.message), { status: 404 });
    }
  }
}
