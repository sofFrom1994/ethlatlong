import { ConnectButton } from '@rainbow-me/rainbowkit';

export const Header = () => {
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
      </div>
    </header>
  );
};