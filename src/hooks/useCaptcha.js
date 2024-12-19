import axios from "axios";
import { getWAFEnv } from "../utils/getWAFEnv";

export function useCaptcha(onCaptchaEvent = (event) => console.log(event)) {
  const captchaAxios = axios.create();

  function renderCaptcha() {
    if (typeof window.AwsWafCaptcha === "undefined") {
      console.error("AwsWafCaptcha n'est pas encore chargé.");
      return Promise.reject(new Error("AwsWafCaptcha n'est pas disponible"));
    }

    document.body.style.cursor = "wait";
    document.getElementById("modalOverlay").style.display = "block";
    document.getElementById("modal").style.display = "block";

    return new Promise((resolve) => {
      onCaptchaEvent("onCaptchaRequired");
      window.AwsWafCaptcha.renderCaptcha(
        document.getElementById("captchaForm"),
        {
          onSuccess: (wafToken) => {
            document.getElementById("modalOverlay").style.display = "none";
            document.getElementById("modal").style.display = "none";
            onCaptchaEvent("onSuccess");
            resolve(wafToken);
          },
          onLoad: () => {
            document.body.style.cursor = "default";
            onCaptchaEvent("onLoad");
          },
          onError: () => onCaptchaEvent("onError"),
          onPuzzleTimeout: () => onCaptchaEvent("onPuzzleTimeout"),
          onPuzzleIncorrect: () => onCaptchaEvent("onPuzzleIncorrect"),
          onPuzzleCorrect: () => onCaptchaEvent("onPuzzleCorrect"),

          apiKey: getWAFEnv().VITE_CAPTCHA_API_KEY,
        }
      );
    });
  }

  const captchaRequired = (error) =>
    error.response.status === 405 &&
    error.response.headers["x-amzn-waf-action"] === "captcha";

  captchaAxios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (captchaRequired(error)) {
        return renderCaptcha().then((token) => {
          console.log("TOKEN1", token);
          return captchaAxios.request(error.config);
        });
      } else return Promise.reject(error);
    }
  );

  captchaAxios.interceptors.request.use(
    (config) => {
      return window.AwsWafIntegration.getToken().then((token) => {
        console.log("TOKEN2", token);
        return config;
      });
    },
    (_) => Promise.reject(_)
  );

  return { captchaAxios, renderCaptcha };
}
