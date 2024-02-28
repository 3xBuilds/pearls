"use client"

import Image from "next/image"
import { ConnectButton } from '@rainbow-me/rainbowkit';

export const WalletConnectButton = () => {
  return (
    <div className='block'>
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus ||
            authenticationStatus === 'authenticated');
        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              'style': {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button onClick={openConnectModal} type="button" className='bg-yellow-400 border-2 border-black text-black rounded-md px-3 py-2.5 shadow-xl transform transition duration-300 ease-in-out shadow-black/30 hover:-translate-y-1 hover:bg-yellow-200'>
                    Connect Wallet
                  </button>
                );
              }
              if (chain.unsupported) {
                return (
                  <button onClick={openChainModal} type="button" className='bg-red-500 border-2 border-black text-black rounded-md px-3 py-2.5 shadow-xl transform transition duration-300 ease-in-out shadow-black/30 hover:-translate-y-1 hover:bg-red-300'>
                    Wrong network
                  </button>
                );
              }
              return (
                <div style={{ display: 'flex', gap: 12 }}>
                  <button
                    onClick={openChainModal}
                    type="button"
                    className='border-2 h-fit my-auto border-black rounded-full overflow-hidden flex items-center justify-center'
                  >
                    {chain.hasIcon && (
                      <div
                        style={{
                          background: chain.iconBackground
                        }}
                        className="w-full h-full overflow-hidden flex items-center justify-center"
                      >
                        {chain.iconUrl && (
                          <Image
                          width={200}
                          height={200}
                          className="w-full h-full object-cover"
                            alt={chain.name ?? 'Chain icon'}
                            src={chain.iconUrl}
                            style={{ width: 38, height: 38 }}
                          />
                        )}
                      </div>
                    )}
                    {/* {chain.name} */}
                  </button>
                  <button title='Click to view address' onClick={openAccountModal} type="button" className='text-white bg-pearl-red border-2 border-black text-black rounded-md px-3 py-2.5 shadow-xl transform transition duration-300 ease-in-out shadow-black/20 hover:-translate-y-1 hover:bg-red-400'>
                    {/* {account.displayName} */}
                    {account.displayBalance
                      ? ` ${account.displayBalance}`
                      : ''}
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
    </div>
  );
};