// "use client";

// import Script from "next/script";
// import { useEffect } from "react";

// // Déclaration du type pour window.adsbygoogle
// declare global {
//   interface Window {
//     adsbygoogle: {
//       push: (params: object) => void;
//     }[];
//   }
// }

// interface AdComponentProps {
//   position: "left" | "right" | "top" | "bottom";
//   className?: string;
// }

// export function AdComponent({ position, className }: AdComponentProps) {
//   useEffect(() => {
//     try {
//       const adsbygoogle = window.adsbygoogle || [];
//       adsbygoogle.push({});
//       window.adsbygoogle = adsbygoogle;
//     } catch (err) {
//       console.error("Error loading AdSense:", err);
//     }
//   }, []);

//   return (
//     <div className={`ad-container ${className}`}>
//       <Script
//         async
//         src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID}`}
//         crossOrigin="anonymous"
//         strategy="lazyOnload"
//       />
//       <ins
//         className="adsbygoogle"
//         style={{
//           display: "block",
//           width: "100%",
//           height:
//             position === "left" || position === "right" ? "600px" : "280px",
//         }}
//         data-ad-client={process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID}
//         data-ad-slot={process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_SLOT}
//         data-ad-format="auto"
//         data-full-width-responsive="true"
//       />
//     </div>
//   );
// }
