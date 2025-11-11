import { useState, useEffect, useCallback } from "react";
import sdk, { type Context, type MiniAppNotificationDetails, AddMiniApp } from "@farcaster/miniapp-sdk";
import { createStore } from "mipd";

export function useMiniApp() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<Context.MiniAppContext>();
  const [added, setAdded] = useState(false);
  const [notificationDetails, setNotificationDetails] = useState<MiniAppNotificationDetails | null>(null);
  const [lastEvent, setLastEvent] = useState("");
  const [addFrameResult, setAddFrameResult] = useState("");

  const addFrame = useCallback(async () => {
    try {
      setNotificationDetails(null);

      const result = await sdk.actions.addMiniApp();

      if (result.notificationDetails) {
        setNotificationDetails(result.notificationDetails);
      }
      setAddFrameResult(
        result.notificationDetails
          ? `Added, got notificaton token ${result.notificationDetails.token} and url ${result.notificationDetails.url}`
          : "Added, got no notification details"
      );
    } catch (error) {
      if (error instanceof AddMiniApp.RejectedByUser) {
        setAddFrameResult(`Not added: ${error.message}`);
      }

      if (error instanceof AddMiniApp.InvalidDomainManifest) {
        setAddFrameResult(`Not added: ${error.message}`);
      }

      setAddFrameResult(`Error: ${error}`);
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      const context = await sdk.context;
      setContext(context);
      setIsSDKLoaded(true);

      // Set up event listeners
      sdk.on("miniAppAdded", ({ notificationDetails }) => {
        console.log("Frame added", notificationDetails);
        setAdded(true);
        setNotificationDetails(notificationDetails ?? null);
        setLastEvent("Frame added");
      });

      sdk.on("miniAppAddRejected", ({ reason }) => {
        console.log("Frame add rejected", reason);
        setAdded(false);
        setLastEvent(`Frame add rejected: ${reason}`);
      });

      sdk.on("miniAppRemoved", () => {
        console.log("Frame removed");
        setAdded(false);
        setLastEvent("Frame removed");
      });

      sdk.on("notificationsEnabled", ({ notificationDetails }) => {
        console.log("Notifications enabled", notificationDetails);
        setNotificationDetails(notificationDetails ?? null);
        setLastEvent("Notifications enabled");
      });

      sdk.on("notificationsDisabled", () => {
        console.log("Notifications disabled");
        setNotificationDetails(null);
        setLastEvent("Notifications disabled");
      });

      sdk.on("primaryButtonClicked", () => {
        console.log("Primary button clicked");
        setLastEvent("Primary button clicked");
      });

      // Call ready action
      console.log("Calling ready");
      sdk.actions.ready({});

      // Set up MIPD Store
      const store = createStore();
      store.subscribe((providerDetails) => {
        console.log("PROVIDER DETAILS", providerDetails);
      });
    };

    if (sdk && !isSDKLoaded) {
      console.log("Calling load");
      load();
      return () => {
        sdk.removeAllListeners();
      };
    }
  }, [isSDKLoaded]);

  return { isSDKLoaded, context, added, notificationDetails, lastEvent, addFrame, addFrameResult };
}