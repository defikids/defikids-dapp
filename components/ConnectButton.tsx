import { Box, Button } from "@chakra-ui/react";
import { trimAddress } from "@/lib/web3";

const ConnectButton = ({
  handleClick,
  walletAddress,
}: {
  handleClick: () => void;
  walletAddress: string;
}) => {
  return (
    <Box mr={2}>
      <Button variant="outline" size="lg" onClick={handleClick}>
        {walletAddress ? trimAddress(walletAddress) : <span>Connect</span>}
      </Button>
    </Box>
  );
};

export default ConnectButton;
