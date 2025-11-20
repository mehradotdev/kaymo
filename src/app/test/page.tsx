"use client";

import { useState } from "react";
import { testNeynarAPI } from "~/app/actions";

export default function TestPage() {
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const runTest = async () => {
        setLoading(true);
        const res = await testNeynarAPI();
        setResult(res);
        setLoading(false);
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1>Neynar API Test</h1>
            <button onClick={runTest} disabled={loading}>
                {loading ? "Testing..." : "Test Neynar API"}
            </button>

            {result && (
                <pre style={{ background: "#f4f4f4", padding: "10px", marginTop: "20px", overflow: "auto" }}>
                    {JSON.stringify(result, null, 2)}
                </pre>
            )}
        </div>
    );
}
