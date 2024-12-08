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

// export default function AdSenseProvider({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   useEffect(() => {
//     try {
//       const adsbygoogle = window.adsbygoogle || [];
//       adsbygoogle.push({});
//       window.adsbygoogle = adsbygoogle;
//     } catch (err) {
//       console.error("Erreur AdSense:", err);
//     }
//   }, []);

//   return (
//     <>
//       <Script
//         async
//         src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
//         strategy="afterInteractive"
//         crossOrigin="anonymous"
//       />
//       {children}
//     </>
//   );
// }
