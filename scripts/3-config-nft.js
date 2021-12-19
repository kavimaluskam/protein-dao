import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

const bundleDrop = sdk.getBundleDropModule(
  process.env.REACT_APP_DROP_MODULE_ADDRESS
);

(async () => {
  try {
    await bundleDrop.createBatch([
      {
        name: "Your virtual personal trainer (senpai)",
        description: "This NFT will give you access to Protein DAO!",
        image: readFileSync("scripts/assets/muscle.gif"),
      },
    ]);
    console.log("✅ Successfully created a new NFT in the drop!");
  } catch (error) {
    console.error("failed to create the new NFT", error);
  }
})();
