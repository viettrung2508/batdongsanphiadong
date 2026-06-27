declare global {
  interface Window {
    google?: any;
    __googleMapsLoader?: Promise<any>;
  }
}

export async function loadGoogleMapsApi(apiKey: string) {
  if (typeof window === "undefined") {
    throw new Error("Google Maps API can only be loaded in the browser.");
  }

  if (window.google?.maps) {
    return window.google;
  }

  if (window.__googleMapsLoader) {
    return window.__googleMapsLoader;
  }

  window.__googleMapsLoader = new Promise((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>('script[data-google-maps="true"]');

    if (existingScript) {
      existingScript.addEventListener("load", () => {
        if (window.google) {
          resolve(window.google);
        } else {
          reject(new Error("Google Maps API failed to initialize."));
        }
      });
      existingScript.addEventListener("error", () => reject(new Error("Failed to load Google Maps API.")));
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=weekly&loading=async&libraries=places`;
    script.async = true;
    script.defer = true;
    script.dataset.googleMaps = "true";
    script.onload = () => {
      if (window.google) {
        resolve(window.google);
      } else {
        reject(new Error("Google Maps API failed to initialize."));
      }
    };
    script.onerror = () => reject(new Error("Failed to load Google Maps API."));
    document.head.appendChild(script);
  });

  return window.__googleMapsLoader;
}
