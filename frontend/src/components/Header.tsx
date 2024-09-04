import "../styles/Header.css";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { UserTimeline } from "./UserTimeline";
import { Config, UseAccountReturnType } from "wagmi";
import { layerType } from "./types";
import { ReadContractErrorType } from "wagmi/actions";

export const Header = (props: {
  account: UseAccountReturnType<Config>;
  map: L.Map | null;
  layers: layerType[];
  error: ReadContractErrorType | null;
}) => {
  let separator = null;

  if (props.account.isConnected) {
    separator = () => {
      return <div className="separator">&nbsp;</div>;
    };
  }

  return (
    <header>
      <div className="header-content">
        <h1>
          {" "}
          <a title="home" href="/">
            you are here{" "}
          </a>
        </h1>
        <div className="account-manager">
          <ConnectButton
            label="Sign in"
            accountStatus={{
              smallScreen: "avatar",
              largeScreen: "full",
            }}
            showBalance={{
              smallScreen: false,
              largeScreen: false,
            }}
          />
        </div>
        {separator && separator()}
        <UserTimeline
          account={props.account}
          map={props.map}
          layers={props.layers}
          error={props.error}
        />
      </div>
    </header>
  );
};
