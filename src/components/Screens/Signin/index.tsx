import ScreenLayout from "../layout";
import { useCallback, useEffect, useState } from "react";
import { useUserStore } from "~/store/userStore";

const Signin = () => {
  const setUser = useUserStore((state) => state.setUser);
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
    window.onSignInSuccess = async (data) => {
      setUser({
        fid: data.fid,
        signerUuid: data.signer_uuid,
        username: data?.user?.username ?? "",
        displayName: data?.user?.display_name ?? "",
        pfp: data?.user?.pfp_url ?? "",
      });
    };

    return () => {
      delete window.onSignInSuccess; // Clean up the global callback
    };
  }, [setUser]);

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
    neynar_login_url
  ]);

  return (
    <ScreenLayout>
      <main className="flex flex-grow flex-col items-center justify-center">
        <div className="mx-5 flex flex-col items-center justify-center">
          <h2 className="text-4xl font-extralight mb-4">
            {"Wowow Farcaster"}
          </h2>

          {getButton()}

        </div>
      </main>
    </ScreenLayout>
  );
};

export default Signin;
