import {client} from "../../config/app.js";

export async function aiOutput(input) {
    const response = await client.responses.create({
        model: process.env.OPENAI_MODEL,
        input
    });
    return response;
}