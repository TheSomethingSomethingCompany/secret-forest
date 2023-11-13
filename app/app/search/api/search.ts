import type { NextApiRequest, NextApiHandler, NextApiResponse } from "next";
import { PrismaClient } from '@prisma/client/edge'
import prisma from "@/app/lib/prisma";


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse    
)  
{   // Check if the HTTP request method is a GET request
    if (req.method === "GET"){
        try {
            const prisma = new PrismaClient()

            // Extract the "q" query parameter from the request
            const {q: query} = req.query;
            if (typeof query !== "string"){
                throw new Error("request not a string");
            }
            // Use Prisma to query the database and find matching records
            const findInfo = await prisma.member.findMany({
                where: {
                   OR: [{
                    name: {
                        contains: query,
                        mode: "insensitive",
                    },
                   }, {
                    username: {
                        contains: query,
                        mode: "insensitive",
                    },

                   },
                    
                   ],
                },
               
            });
            //res.status(200).json({findInfo});
            res.status(200).json({message: "It's working"});

        } catch (error){
            res.status(500).end();

        }
    }
    
    
}