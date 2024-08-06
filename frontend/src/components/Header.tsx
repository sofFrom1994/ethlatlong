import "../styles/Header.css"
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { UserTimeline } from "./UserTimeline";
import { Config, UseAccountReturnType } from "wagmi";

export const Header = (props: {account : UseAccountReturnType<Config> }) => {
  return (
    <header>
      <div className="header-content">
        <h1>eth-lat-long</h1>
        <div className="account-manager">
          <ConnectButton
            label="Sign in"
            accountStatus={{
              smallScreen: 'avatar',
              largeScreen: 'full'
            }}
            showBalance={{
              smallScreen: false,
              largeScreen: false,
            }}
          />
        </div>
          <UserTimeline account={props.account}/>
      </div>
    </header>
  );
};