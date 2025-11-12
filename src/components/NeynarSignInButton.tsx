import { useAuthActions } from "@convex-dev/auth/react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export function NeynarSignInButton() {
  const { signIn } = useAuthActions();
  const [theme, setTheme] = useState("light");
  const [variant, setVariant] = useState("neynar");
  const [logoSize, setLogoSize] = useState("30px");
  const [height, setHeight] = useState("48px");
  const [width, setWidth] = useState("218px");
  const [borderRadius, setBorderRadius] = useState("10px");
  const [fontSize, setFontSize] = useState("16px");
  const [fontWeight, setFontWeight] = useState("300");
  const [padding, setPadding] = useState("8px 15px");
  const [margin, setMargin] = useState("0px");
  const [text, setText] = useState("");
  const [color, setColor] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("");
  const [styles, setStyles] = useState("");
  const [customLogoUrl, setCustomLogoUrl] = useState("");

  const client_id = process.env.NEXT_PUBLIC_NEYNAR_CLIENT_ID;
  const neynar_login_url =
    process.env.NEXT_PUBLIC_NEYNAR_LOGIN_URL || "https://app.neynar.com/login";

  if (!client_id) {
    throw new Error("NEXT_PUBLIC_NEYNAR_CLIENT_ID is not defined in .env");
  }

  useEffect(() => {
    // Identify or create the script element
    let script = document.getElementById(
      "siwn-script"
    ) as HTMLScriptElement | null;

    if (!script) {
      script = document.createElement("script");
      script.id = "siwn-script";
      document.body.appendChild(script);
    }

    // Set attributes and source of the script
    script.src = "https://neynarxyz.github.io/siwn/raw/1.2.0/index.js";
    script.async = true;
    script.defer = true;

    document.body.appendChild(script);

    return () => {
      // Remove the script from the body
      if (script) {
        document.body.removeChild(script);
      }

      // Remove the button if it exists
      const button = document.getElementById("siwn-button");
      if (button && button.parentElement) {
        button.parentElement.removeChild(button);
      }
    };
  }, [
    theme,
    variant,
    logoSize,
    height,
    width,
    borderRadius,
    fontSize,
    fontWeight,
    padding,
    margin,
    text,
    color,
    backgroundColor,
    styles,
    customLogoUrl,
  ]);

  useEffect(() => {
    window.onSignInSuccess = async (neynarUserData) => {
      try {
        // Sign in to Convex using the Neynar data
        await signIn("neynar", {
          fid: neynarUserData.fid,
          signerUuid: neynarUserData.signer_uuid,
          username: neynarUserData.user?.username ?? "",
          displayName: neynarUserData.user?.display_name ?? "",
          pfp: neynarUserData.user?.pfp_url ?? "",
        });

        toast.success("Successfully signed in with Neynar!");
      } catch (error) {
        console.error("Neynar sign-in error:", error);
        toast.error("Failed to sign in with Neynar. Please try again.");
      }
    };

    return () => {
      delete window.onSignInSuccess; // Clean up the global callback
    };
  }, [signIn]);

  const getButton = useCallback(() => {
    return (
      <div
        className="neynar_signin mt-6"
        data-client_id={client_id}
        data-neynar_login_url={neynar_login_url}
        data-success-callback="onSignInSuccess"
        data-theme={theme}
        data-variant={variant}
        data-logo_size={logoSize}
        data-height={height}
        data-width={width}
        data-border_radius={borderRadius}
        data-font_size={fontSize}
        data-font_weight={fontWeight}
        data-padding={padding}
        data-margin={margin}
        data-text={text}
        data-color={color}
        data-background_color={backgroundColor}
        data-styles={styles}
        data-custom_logo_url={customLogoUrl}
      ></div>
    );
  }, [
    theme,
    variant,
    logoSize,
    height,
    width,
    borderRadius,
    fontSize,
    fontWeight,
    padding,
    margin,
    text,
    color,
    backgroundColor,
    styles,
    customLogoUrl,
    client_id,
    neynar_login_url,
  ]);

  return <>{getButton()}</>;
}

// export function NeynarSignInButtonOld() {
//   const { signIn } = useAuthActions();
//   const [isLoading, setIsLoading] = useState(false);

//   const handleNeynarSignIn = async () => {
//     setIsLoading(true);

//     try {
//       // TODO: Replace this with actual Neynar popup/SDK integration
//       // This is a placeholder that simulates the Neynar auth flow
//       const neynarUserData = await openNeynarAuthPopup();

//       // Sign in with Convex using the Neynar data
//       await signIn("neynar", {
//         fid: neynarUserData.fid,
//         signerUuid: neynarUserData.signerUuid,
//         username: neynarUserData.username,
//         displayName: neynarUserData.displayName,
//         pfp: neynarUserData.pfp,
//       });

//       toast.success("Successfully signed in with Neynar!");
//     } catch (error) {
//       console.error("Neynar sign-in error:", error);
//       toast.error("Failed to sign in with Neynar. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <button
//       onClick={handleNeynarSignIn}
//       disabled={isLoading}
//       className="auth-button flex items-center justify-center gap-2"
//     >
//       {isLoading ? (
//         <>
//           <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
//           <span>Signing in...</span>
//         </>
//       ) : (
//         <>
//           <svg
//             width="20"
//             height="20"
//             viewBox="0 0 24 24"
//             fill="currentColor"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path d="M12 2L2 7L12 12L22 7L12 2Z" />
//             <path d="M2 17L12 22L22 17" />
//             <path d="M2 12L12 17L22 12" />
//           </svg>
//           <span>Sign in with Neynar</span>
//         </>
//       )}
//     </button>
//   );
// }

// Placeholder function for Neynar auth popup
// Replace this with actual Neynar SDK integration
// async function openNeynarAuthPopup(): Promise<NeynarUserData> {
//   return new Promise((resolve, reject) => {
//     // TODO: Implement actual Neynar popup/SDK flow here
//     // This should:
//     // 1. Open Neynar auth popup
//     // 2. Handle the OAuth-like flow
//     // 3. Return the user data

//     // For now, this is a placeholder that you'll replace with real implementation
//     // Example of what the real implementation might look like:
//     /*
//     const popup = window.open(
//       'https://neynar.com/auth?client_id=YOUR_CLIENT_ID',
//       'neynar-auth',
//       'width=500,height=600'
//     );

//     window.addEventListener('message', (event) => {
//       if (event.origin === 'https://neynar.com') {
//         const userData = event.data;
//         resolve(userData);
//         popup?.close();
//       }
//     });
//     */

//     // Placeholder - remove this in production
//     // setTimeout(() => {
//     //   reject(new Error("Neynar authentication not implemented yet"));
//     // }, 1000);
//   });
// }
