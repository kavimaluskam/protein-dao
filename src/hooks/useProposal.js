import { useEffect, useState } from "react";
import { voteModule } from "../modules";
import { useAddress } from "./useAddress";

export const useProposal = () => {
  const { address, hasClaimedNFT } = useAddress();
  const [proposals, setProposals] = useState([]);

  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }
    // A simple call to voteModule.getAll() to grab the proposals.
    voteModule
      .getAll()
      .then((proposals) => {
        // Set state!
        setProposals(proposals);
        console.log("🌈 Proposals:", proposals);
      })
      .catch((err) => {
        console.error("failed to get proposals", err);
      });
  }, [hasClaimedNFT, address]);

  return proposals;
};
