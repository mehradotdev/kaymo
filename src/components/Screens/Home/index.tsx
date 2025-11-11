"use client";

import Image from "next/image";
import ScreenLayout from "../layout";
import styles from "./index.module.css";
import Button from "~/components/Button";
import { useUserStore } from "~/store/userStore";
import { toast } from "react-toastify";
import { useState } from "react";
import Link from "next/link";

const Home = () => {
  const [text, setText] = useState("");
  const user = useUserStore((state) => state.user);
  const { signerUuid, displayName, pfp, fid } = user || {};
  const profileLink = `https://warpcast.com/~/profiles/${fid}`;

  async function handlePublishCast() {
    try {
      const response = await fetch("/api/cast", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          signerUuid,
          text,
        }),
      });
      const { message } = (await response.json()) as { message: string };
      toast(message, {
        type: "success",
        theme: "dark",
        autoClose: 3000,
        position: "bottom-right",
        pauseOnHover: true,
      });
      setText("");
    } catch (err) {
      // const { message } = (err as Error).message as ErrorRes;
      toast(err as string, {
        type: "error",
        theme: "dark",
        autoClose: 3000,
        position: "bottom-right",
        pauseOnHover: true,
      });
    }
  }

  return (
    <ScreenLayout>
      <main className="flex flex-col flex-grow justify-center items-center">
        {displayName && pfp ? (
          <>
            <p className="text-3xl">
              Hello{" "}
              {displayName && (
                <span className="font-medium">{displayName}</span>
              )}
              ... 👋
            </p>
            <div className={styles.inputContainer}>
              <Image
                src={pfp}
                width={40}
                height={40}
                alt="User Profile Picture"
                className={`${styles.profilePic} rounded-full`}
              />
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className={styles.userInput}
                placeholder="Say Something"
                rows={5}
              />
            </div>
            <Button onClick={handlePublishCast} title="Cast" />
            <div className="w-[460px] flex flex-col gap-4 pt-20 text-sm">
             

              <span>
                Casts will be sent from{" "}
                <Link
                  href={profileLink}
                  target="_blank"
                  className="text-blue-500 underline"
                >
                  {displayName}
                </Link>
                {""}. Sign in with a different account if needed.
              </span>
            </div>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </main>
    </ScreenLayout>
  );
};

export default Home;
