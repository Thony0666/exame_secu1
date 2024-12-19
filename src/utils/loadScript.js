import { getWAFEnv } from "./getWAFEnv";

export function loadScript() {
  if (document.getElementById("AwsWAFScript")) return;

  const AwsWafScript = document.createElement("script");
  AwsWafScript.id = "AwsWAFScript";
  AwsWafScript.async = true;
  const src = getWAFEnv().VITE_JSAPI_URL;
  AwsWafScript.src = src;

  return new Promise((resolve, reject) => {
    AwsWafScript.onload = () => {
      console.log("Script AWS WAF chargé avec succès.");
      resolve();
    };

    AwsWafScript.onerror = (error) => {
      console.error(
        `Erreur lors du chargement du script WAF : ${error.message}`
      );
      reject(new Error("Le script AWS WAF n'a pas pu être chargé"));
    };

    document.head.appendChild(AwsWafScript);
  });
}
