"use client";

import "@uniswap/widgets/fonts.css";
import { SwapWidget, darkTheme } from "@uniswap/widgets";
import { Center, Box, Flex } from "@chakra-ui/react";
import Navbar from "@/components/LandingNavbar";

const Swap = () => {
  const USD = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

  const MY_TOKEN_LIST = [
    {
      name: "Dai Stablecoin",
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
      symbol: "DAI",
      decimals: 18,
      chainId: 1,
      logoURI:
        "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png",
    },
    {
      name: "Tether USD",
      address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      symbol: "USDT",
      decimals: 6,
      chainId: 1,
      logoURI:
        "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png",
    },
    {
      name: "USD Coin",
      address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      symbol: "USDC",
      decimals: 6,
      chainId: 1,
      logoURI:
        "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
    },
  ];

  return (
    <Box height="100vh" bgGradient={["linear(to-b, black,#4F1B7C)"]}>
      <Navbar />
      <Center mt="1rem" height="100%">
        <div className="Uniswap">
          <SwapWidget
            width={460}
            theme={darkTheme}
            // defaultOutputTokenAddress={USD}
            // tokenList={MY_TOKEN_LIST}
          />
        </div>
      </Center>
    </Box>
  );
};

export default Swap;
