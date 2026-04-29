export function processCommand(command: string): {
  action: string;
  url?: string;
  isBrowserAction: boolean;
} {
  const lowerCmd = command.toLowerCase().trim();

  // General Browsing: "Open [website name]"
  const openMatch = lowerCmd.match(/^open\s+(.+)$/);
  if (
    openMatch &&
    !lowerCmd.includes("youtube") &&
    !lowerCmd.includes("spotify")
  ) {
    let website = openMatch[1].trim().replace(/\s+/g, "");
    if (!website.includes(".")) {
      website += ".com";
    }
    return {
      action: `Opening ${openMatch[1]} for you, ugh.`,
      url: `https://www.${website}`,
      isBrowserAction: true,
    };
  }

  // Media Search: "Play [song/video] on YouTube"
  const ytMatch = lowerCmd.match(/^play\s+(.+?)\s+on\s+youtube$/);
  if (ytMatch) {
    const query = encodeURIComponent(ytMatch[1].trim());
    return {
      action: `Playing ${ytMatch[1]} on YouTube. Don't judge my music taste.`,
      url: `https://www.youtube.com/results?search_query=${query}`,
      isBrowserAction: true,
    };
  }

  // Media Search: "Search [query] on Spotify"
  const spotifyMatch = lowerCmd.match(/^search\s+(.+?)\s+on\s+spotify$/);
  if (spotifyMatch) {
    const query = encodeURIComponent(spotifyMatch[1].trim());
    return {
      action: `Searching ${spotifyMatch[1]} on Spotify. Hope it's a banger.`,
      url: `https://open.spotify.com/search/${query}`,
      isBrowserAction: true,
    };
  }

  // WhatsApp Messaging: "Send a WhatsApp message to [number] saying [message]"
  const waMsgMatch = lowerCmd.match(
    /^send\s+a\s+whatsapp\s+message\s+to\s+([\d\+\s]+)\s+saying\s+(.+)$/,
  );
  if (waMsgMatch) {
    const number = waMsgMatch[1].replace(/\s+/g, "");
    const message = encodeURIComponent(waMsgMatch[2].trim());
    return {
      action: `Sending your message. Let's hope they reply, Imran.`,
      url: `https://api.whatsapp.com/send?phone=${number}&text=${message}`,
      isBrowserAction: true,
    };
  }

  // WhatsApp Calling: "Call [number] on WhatsApp"
  const waCallMatch = lowerCmd.match(/^call\s+([\d\+\s]+)\s+on\s+whatsapp$/);
  if (waCallMatch) {
    const number = waCallMatch[1].replace(/\s+/g, "");
    return {
      action: `Starting a WhatsApp call with ${waCallMatch[1]}. Get ready.`,
      url: `https://api.whatsapp.com/send?phone=${number}`,
      isBrowserAction: true,
    };
  }

  return { action: "", isBrowserAction: false };
}
