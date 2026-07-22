export const getEnhancedFingerprint = async (): Promise<string> => {
  if (typeof window === "undefined") return "Unknown Device";
  
  const ua = navigator.userAgent;
  let browser = "Unknown Browser";

  // Detailed Browser Detection based on the Master List
  try {
    // 1. Try brave-specific API (simplest check: does navigator.brave exist?)
    if ((navigator as any).brave) {
      browser = "Brave";
    }

    // 2. Try userAgentData brands (modern Chromium way)
    if (browser === "Unknown Browser" && (navigator as any).userAgentData?.brands) {
      const brands = (navigator as any).userAgentData.brands;
      for (const b of brands) {
        const brand = b.brand;
        if (brand.includes("Brave")) browser = "Brave";
        else if (brand.includes("Opera")) browser = "Opera";
        else if (brand.includes("Edge")) browser = "Edge";
        else if (brand.includes("Vivaldi")) browser = "Vivaldi";
        else if (brand.includes("DuckDuckGo")) browser = "DuckDuckGo";
      }
    }
  } catch (e) {
    // Ignore errors in async detection
  }

  // 3. Fallback to UserAgent string matching
  if (browser === "Unknown Browser") {
    if (ua.includes("OPR/") || ua.includes("Opera")) {
      browser = "Opera";
    } else if (ua.includes("Edg/")) {
      browser = "Edge";
    } else if (ua.includes("Vivaldi")) {
      browser = "Vivaldi";
    } else if (ua.includes("DuckDuckGo")) {
      browser = "DuckDuckGo";
    } else if (ua.includes("LibreWolf")) {
      browser = "LibreWolf";
    } else if (ua.includes("Waterfox")) {
      browser = "Waterfox";
    } else if (ua.includes("Floorp")) {
      browser = "Floorp";
    } else if (ua.includes("Zen")) {
      browser = "Zen Browser";
    } else if (ua.includes("Thorium")) {
      browser = "Thorium";
    } else if (ua.includes("Arc")) {
      browser = "Arc";
    } else if (ua.includes("Epic")) {
      browser = "Epic Privacy";
    } else if (ua.includes("Mullvad")) {
      browser = "Mullvad Browser";
    } else if (ua.includes("Perplexity") || ua.includes("PTY")) {
      browser = "Perplexity Comet";
    } else if (ua.includes("Dia")) {
      browser = "Dia Browser";
    } else if (ua.includes("ChatGPT")) {
      browser = "ChatGPT Atlas";
    } else if (ua.includes("Chrome") && ua.includes("Safari") && !ua.includes("Edg/") && !ua.includes("OPR/")) {
      browser = "Chrome";
    } else if (ua.includes("Safari") && !ua.includes("Chrome")) {
      browser = "Safari";
    } else if (ua.includes("Firefox")) {
      browser = "Firefox";
    }
  }

  // OS Detection
  let os = "Unknown OS";
  if (ua.includes("Win")) os = "Windows";
  else if (ua.includes("Mac")) os = "Mac";
  else if (ua.includes("Linux")) os = "Linux";
  else if (ua.includes("Android")) os = "Android";
  else if (ua.includes("like Mac")) os = "iOS";

  return `${browser} on ${os} | ${ua}`;
};
