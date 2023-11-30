"use client";

import { Box, Button, Heading } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { usePathname } from "next/navigation";

export const CustomConnectButton = () => {
  const pathname = usePathname();

  return (
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
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");
        return (
          <Box
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button
                    onClick={openConnectModal}
                    type="button"
                    mr={5}
                    size="lg"
                  >
                    <Heading size={pathname === "/" ? "sm" : "md"}>
                      Connect{" "}
                    </Heading>
                  </Button>
                );
              }
              if (chain.unsupported) {
                return (
                  <Button onClick={openChainModal} type="button">
                    Wrong network
                  </Button>
                );
              }
              // return fetchedUserDetails ? (
              //   <Box style={{ display: "flex", gap: 12 }}>
              //     <>
              //       <Button
              //         onClick={openChainModal}
              //         style={{ display: "flex", alignItems: "center" }}
              //         type="button"
              //       >
              //         {chain.hasIcon && (
              //           <Box
              //             style={{
              //               background: chain.iconBackground,
              //               width: 12,
              //               height: 12,
              //               borderRadius: 999,
              //               overflow: "hidden",
              //               marginRight: 4,
              //             }}
              //           >
              //             {chain.iconUrl && (
              //               <img
              //                 alt={chain.name ?? "Chain icon"}
              //                 src={chain.iconUrl}
              //                 style={{ width: 12, height: 12 }}
              //               />
              //             )}
              //           </Box>
              //         )}
              //         {chain.name}
              //       </Button>
              //       <Button onClick={openAccountModal} type="button">
              //         {account.displayName}
              //         {account.displayBalance
              //           ? ` (${account.displayBalance})`
              //           : ""}
              //       </Button>
              //     </>
              //   </Box>
              // ) : (
              //   <></>
              // );
            })()}
          </Box>
        );
      }}
    </ConnectButton.Custom>
  );
};
