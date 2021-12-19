import { ThirdwebSDK } from "@3rdweb/sdk";

export const sdk = new ThirdwebSDK("rinkeby");

export const bundleDropModule = sdk.getBundleDropModule(
  process.env.REACT_APP_DROP_MODULE_ADDRESS
);
export const tokenModule = sdk.getTokenModule(
  process.env.REACT_APP_ERC20_MODULE_ADDRESS
);
export const voteModule = sdk.getVoteModule(
  process.env.REACT_APP_VOTE_MODULE_ADDRESS
);
