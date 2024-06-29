import { ConnectButton } from '@rainbow-me/rainbowkit';

export const Header = () => {
  return (
    <header>
      <div className="header-content">
        <h1>eth-lat-long</h1>
        <ConnectButton
          showBalance={{
            smallScreen: false,
            largeScreen: true,
          }}
        />
      </div>
    </header>
  );
};