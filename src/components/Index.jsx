import { createPortal } from "react-dom";
import { useEffect } from "react";
import { loadScript } from "../utils/loadScript";

function CaptchaModal() {
  useEffect(() => {
    (async () => {
      await loadScript();
    })();
  });

  return createPortal(
    <div className="overlay" id="modalOverlay">
      <div className="modal" id="modal">
        <div id="captchaForm" />
      </div>
    </div>,
    document.body
  );
}

export default CaptchaModal;
