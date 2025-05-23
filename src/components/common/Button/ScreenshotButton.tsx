import { useAtomValue } from "jotai";
import { FaCamera } from "react-icons/fa";
import Button from "./Button";
import { pixiAppAtom } from "../../../atoms";

const ScreenshotButton = () => {
  const app = useAtomValue(pixiAppAtom);

  const takeScreenshot = async () => {
    if (!app) {
      return;
    }

    app.stop();

    const url = await app.renderer.extract.base64(app.stage);
    const anchor = document.createElement("a");

    document.body.append(anchor);
    anchor.download = "screenshot";
    anchor.href = url;
    anchor.click();
    anchor.remove();

    app.start();
  };

  return (
    <div className="u-absolute u-z-1 u-bottom-0 u-left-0 ml-4 mb-4">
      <Button onClick={takeScreenshot} className="btn-light u-round-full">
        <FaCamera size={16} className="u-center" />
      </Button>
    </div>
  );
};

export default ScreenshotButton;
