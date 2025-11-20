import "server-only";
import { NeynarAPIClient } from "@neynar/nodejs-sdk";

console.log("[NEYNAR CLIENT] Initializing with API key:", process.env.NEYNAR_API_KEY ? "SET" : "NOT SET");

if (!process.env.NEYNAR_API_KEY) {
    throw new Error("Make sure you set NEYNAR_API_KEY in your .env file");
}

const client = new NeynarAPIClient({
    apiKey: process.env.NEYNAR_API_KEY
});

console.log("[NEYNAR CLIENT] Client initialized successfully");

export default client;

