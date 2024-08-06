import "../styles/Header.css";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { UserTimeline } from "./UserTimeline";
import { Config, UseAccountReturnType } from "wagmi";

export const Header = (props: { account: UseAccountReturnType<Config> }) => {
  let separator = null;

  if (props.account.isConnected) {
    separator = () => {
      return <div className="separator" >&nbsp;</div>;
    };
  }

  return (
    <header>
      <div className="header-content">
        <h1>eth-lat-long</h1>
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
        <UserTimeline account={props.account} />
      </div>
    </header>
  );
};
