"use server";

import neynarClient from "~/clients/neynar";

// Free alternative: Use Farcaster Hub API via NodeRPC's free endpoint
const FARCASTER_HUB_API = "https://api.noderpc.xyz/farcaster-mainnet-hub";

// Workaround: Use a curated list of popular Farcaster users for search
// This is a fallback until you get a paid Neynar API key
const POPULAR_USERS = [
    { fid: 3, username: "dwr", display_name: "Dan Romero", pfp_url: "https://i.imgur.com/fR7VXqe.jpg" },
    { fid: 2, username: "v", display_name: "Varun Srinivasan", pfp_url: "https://i.imgur.com/fR7VXqe.jpg" },
    { fid: 1, username: "farcaster", display_name: "Farcaster", pfp_url: "https://i.imgur.com/fR7VXqe.jpg" },
    { fid: 5650, username: "vitalik", display_name: "Vitalik Buterin", pfp_url: "https://i.imgur.com/fR7VXqe.jpg" },
    { fid: 239, username: "jessepollak", display_name: "Jesse Pollak", pfp_url: "https://i.imgur.com/fR7VXqe.jpg" },
    { fid: 602, username: "ccarella", display_name: "Cassie", pfp_url: "https://i.imgur.com/fR7VXqe.jpg" },
    { fid: 3621, username: "horsefacts", display_name: "horsefacts", pfp_url: "https://i.imgur.com/fR7VXqe.jpg" },
    { fid: 1048, username: "colin", display_name: "Colin", pfp_url: "https://i.imgur.com/fR7VXqe.jpg" },
    { fid: 1214, username: "toadyhawk", display_name: "toadyhawk.eth", pfp_url: "https://i.imgur.com/fR7VXqe.jpg" },
    { fid: 457, username: "macbudkowski", display_name: "macbudkowski", pfp_url: "https://i.imgur.com/fR7VXqe.jpg" },
];

export async function searchUsers(query: string) {
    try {
        console.log("[SERVER ACTION] searchUsers called with query:", query);

        // WORKAROUND: Use local filtering of popular users
        // This is a free alternative that doesn't require API calls
        const filteredUsers = POPULAR_USERS.filter(
            (user) =>
                user.username.toLowerCase().includes(query.toLowerCase()) ||
                user.display_name.toLowerCase().includes(query.toLowerCase())
        );

        console.log("[SERVER ACTION] Matched users:", filteredUsers.length);

        return {
            users: filteredUsers.map(u => ({
                fid: u.fid,
                username: u.username,
                display_name: u.display_name,
                pfp_url: u.pfp_url,
            })),
        };
    } catch (error) {
        console.error("[SERVER ACTION] Error searching users:", error);
        return { users: [] };
    }
}

// Keep the original function for when you upgrade to paid Neynar
export async function searchUsersNeynar(query: string) {
    try {
        const result = await neynarClient.searchUser({
            q: query,
        });

        return {
            users: result.result.users,
        };
    } catch (error) {
        console.error("[SERVER ACTION] Neynar search error:", error);
        return { users: [] };
    }
}

export async function searchChannels(query: string) {
    try {
        const result = await neynarClient.searchChannels({
            q: query,
        });

        return {
            channels: result.channels,
        };
    } catch (error) {
        console.error("Error searching channels:", error);
        return { channels: [] };
    }
}

// Test function
export async function testNeynarAPI() {
    try {
        console.log("[TEST] Testing Neynar API...");
        const result = await neynarClient.searchUser({
            q: "vitalik",
        });

        console.log("[TEST] Full API response:", JSON.stringify(result, null, 2));
        return { success: true, result };
    } catch (error: any) {
        console.error("[TEST] API Error:", error.message, error.response?.data);
        return { success: false, error: error.message };
    }
}
