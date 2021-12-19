import { useEffect, useState } from "react";
import { useWeb3 } from "@3rdweb/hooks";
import { bundleDropModule } from "../modules";

export const useAddress = () => {
  const { address, connectWallet } = useWeb3();
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  const mintNft = () => {
    setIsClaiming(true);
    // Call bundleDropModule.claim("0", 1) to mint nft to user's wallet.
    bundleDropModule
      .claim("0", 1)
      .catch((err) => {
        console.error("failed to claim", err);
        setIsClaiming(false);
      })
      .finally(() => {
        // Stop loading state.
        setIsClaiming(false);
        // Set claim state.
        setHasClaimedNFT(true);
        // Show user their fancy new NFT!
        console.log(
          `🌊 Successfully Minted! Check it out on OpenSea: https://testnets.opensea.io/assets/${bundleDropModule.address}/0`
        );
      });
  };

  useEffect(() => {
    if (!address) {
      return;
    }
    return bundleDropModule
      .balanceOf(address, "0")
      .then((balance) => {
        if (balance.gt(0)) {
          setHasClaimedNFT(true);
          console.log("🌟 this user has a membership NFT!");
        } else {
          setHasClaimedNFT(false);
          console.log("😭 this user doesn't have a membership NFT.");
        }
      })
      .catch((error) => {
        setHasClaimedNFT(false);
        console.error("failed to nft balance", error);
      });
  }, [address]);

  return { address, hasClaimedNFT, isClaiming, connectWallet, mintNft };
};
