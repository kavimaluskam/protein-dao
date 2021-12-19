import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

// Import ThirdWeb
import { ThirdwebWeb3Provider } from "@3rdweb/hooks";

// Include what chains you wanna support.
// 4 = Rinkeby.
const supportedChainIds = [4];

// Include what type of wallet you want to support.
// In this case, we support Metamask which is an "injected wallet".
const connectors = {
  injected: {},
};

// Finally, wrap App with ThirdwebWeb3Provider.
ReactDOM.render(
  <React.StrictMode>
    <ThirdwebWeb3Provider
      connectors={connectors}
      supportedChainIds={supportedChainIds}
    >
      <div className="background" />
      <div className="landing">
        <App />
        <div className="footer">
          Demo Project by{" "}
          <a href="https://twitter.com/@kavimaluskam">@kavimaluskam</a>, with{" "}
          <a href="https://twitter.com/@_buildspace">@_buildspace</a> &{" "}
          <a href="https://twitter.com/@thirdweb_">@thirdweb_</a>
        </div>
      </div>
    </ThirdwebWeb3Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
