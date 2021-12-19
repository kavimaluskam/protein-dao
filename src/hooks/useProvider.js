import { useEffect } from "react";
import { useWeb3 } from "@3rdweb/hooks";
import { sdk } from "../modules";

export const useProvider = () => {
  const { provider } = useWeb3();
  // The signer is required to sign transactions on the blockchain.
  // Without it we can only read data, not write.
  const signer = provider ? provider.getSigner() : undefined;

  useEffect(() => {
    // We pass the signer to the sdk, which enables us to interact with
    // our deployed contract!
    sdk.setProviderOrSigner(signer);
  }, [signer]);
};
