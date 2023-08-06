import { Box, Button } from "@chakra-ui/react";

const ConnectButton = ({
  handleClick,
  walletAddress,
}: {
  handleClick: () => void;
  walletAddress: string;
}) => {
  const trimAddress = (address) => {
    return address.slice(0, 5) + "..." + address.slice(-4);
  };

  return (
    <Box mr={2}>
      <Button variant="outline" onClick={handleClick}>
        {walletAddress ? trimAddress(walletAddress) : <span>Connect</span>}
      </Button>
    </Box>
  );
};

export default ConnectButton;
