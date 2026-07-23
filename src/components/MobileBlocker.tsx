import { ReactNode, useEffect, useState } from "react";
import { MonitorX } from "lucide-react";

const checkMobile = () => {
  if (typeof window === "undefined") return false;

  // Developer Bypass
  if (window.location.search.includes("bypass=true")) {
    localStorage.setItem("mobile_bypass", "true");
    return false;
  }
  if (localStorage.getItem("mobile_bypass") === "true") {
    return false;
  }

  const ua = navigator.userAgent;
  
  // 1. Basic User Agent Check (Catches honest mobile browsers)
  const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  
  // 2. Hardware Input Check (Catches "Desktop Site" spoofing on mobile)
  const isTouchOnly = window.matchMedia("(any-pointer: coarse) and (any-hover: none)").matches;
  
  // 3. iPad Desktop Mode Check
  const isIPadDesktop = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;

  // 4. Very small screen check (Catch-all for weird spoofing)
  const isVerySmallScreen = window.screen.width < 500 && window.screen.height < 900;

  return isMobileUA || isTouchOnly || isIPadDesktop || isVerySmallScreen;
};

export function MobileBlocker({ children }: { children: ReactNode }) {
  const [isMobile, setIsMobile] = useState(() => checkMobile());

  useEffect(() => {
    // Optional: Re-check on resize in case they somehow toggle modes
    const handleResize = () => setIsMobile(checkMobile());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isMobile) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6 text-center">
        <MonitorX className="mb-6 h-24 w-24 text-destructive" />
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-foreground">
          Mobile Access Disabled
        </h1>
        <p className="max-w-md text-lg text-muted-foreground">
          CodeBuddy requires a desktop or laptop computer. Please access this site from a computer to continue.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
