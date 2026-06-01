import {getAllPosts} from "../src/models/articleModel.js";
import {S3Client} from "@aws-sdk/client-s3";
import {OpenAI} from "openai";

export const r2 = new S3Client({
    region: "auto",
    endpoint: process.env.R2_ENDPOINT,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
});



export const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

