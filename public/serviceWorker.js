const registerServiceWorker = () => {
  if (typeof window !== "undefined" && "serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then((registration) => {
          
          console.log("Service Worker registered with scope:", registration.scope, registration);
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    });
  }
};
export default registerServiceWorker;
