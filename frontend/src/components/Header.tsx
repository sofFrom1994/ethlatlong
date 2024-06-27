import AccountManager from './AccountManager';

export const Header = () => {
  return (
    <header>
      <div className="header-content">
        <h1>eth-lat-long</h1>
        <AccountManager />
      </div>
    </header>
  );
};