import { EtherscanContext } from "@/dataSchema/enums";
import { getEtherscanUrl, trimAddress } from "@/utils/web3";
import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Spinner,
  Switch,
  Text,
  Image,
  useToast,
  Avatar,
} from "@chakra-ui/react";
import { useNetwork } from "wagmi";
import { formatDateToIsoString } from "@/utils/dateTime";
import { ChildDetails } from "@/dataSchema/types";

export const ChildOverviewParentDashboard = ({
  childDetails,
  onOpenChangeUsername,
  isLoading,
  handleSandboxToggle,
  onOpen,
  onSendFundsOpen,
}: {
  childDetails: ChildDetails;
  onOpenChangeUsername: () => void;
  isLoading: boolean;
  handleSandboxToggle: () => void;
  onOpen: () => void;
  onSendFundsOpen: () => void;
}) => {
  const toast = useToast();
  const { chain } = useNetwork();

  return (
    <Box>
      <Heading size="md" mt={5} mb={2}>
        UserName
      </Heading>
      <Flex justifyContent="space-between" align="center">
        <Text>{childDetails.username}</Text>
        <Button size="sm" colorScheme="blue" onClick={onOpenChangeUsername}>
          Edit
        </Button>
      </Flex>
      <Divider my={2} borderColor="gray.500" />

      {/* Account Status */}
      <Heading size="md" mt={10} mb={2}>
        Member Since
      </Heading>
      <Flex justifyContent="space-between" align="center">
        <Text>{formatDateToIsoString(childDetails.memberSince * 1000)}</Text>
      </Flex>
      <Divider my={2} borderColor="gray.500" />

      {/* Sandbox */}
      <Heading size="md" mt={10} mb={2}>
        Sandbox Mode
      </Heading>
      <Flex justifyContent="space-between" align="center">
        <Text>{childDetails.sandboxMode ? "Enabled" : "Disabled"}</Text>

        {isLoading ? (
          <Spinner size="md" />
        ) : (
          <Switch size="lg" onChange={handleSandboxToggle} />
        )}
      </Flex>
      <Divider my={2} borderColor="gray.500" />

      {/* Wallet Details */}
      <Heading size="md" mt={10} mb={2}>
        Wallet Details
      </Heading>

      {/* Balance */}
      <Flex justifyContent="space-between" align="center">
        <Flex justify="flex-start" align="center">
          <Image
            src="/logos/ethereum-eth-logo.png"
            alt="USDCX"
            width={10}
            height={10}
            mr={2}
          />

          <Text fontSize="lg">{childDetails.balance}</Text>
        </Flex>
        <Button
          size="sm"
          colorScheme="blue"
          onClick={() => {
            window.open(
              getEtherscanUrl(
                chain.id,
                EtherscanContext.ADDRESS,
                childDetails.wallet
              ),
              "_blank"
            );
          }}
        >
          View
        </Button>
      </Flex>

      {/* Address */}
      <Flex justifyContent="space-between" align="center" mt={4}>
        <Text>{trimAddress(childDetails.wallet)}</Text>

        <Button
          size="sm"
          colorScheme="blue"
          onClick={() => {
            navigator.clipboard.writeText(childDetails.wallet);
            toast({
              title: "Address Copied",
              status: "success",
              duration: 3000,
              isClosable: true,
            });
          }}
        >
          Copy
        </Button>
      </Flex>
      <Divider my={2} borderColor="gray.500" />

      {/* Avatar */}
      <Heading size="md" mt={5} mb={4}>
        Avatar
      </Heading>
      <Flex justifyContent="space-between" align="center" ml={2}>
        <Avatar
          size="2xl"
          name={childDetails.username}
          src={
            childDetails.avatarURI
              ? childDetails.avatarURI
              : "/images/placeholder-avatar.jpeg"
          }
        />
        <Button size="sm" colorScheme="blue" onClick={onOpen}>
          Edit
        </Button>
      </Flex>

      <Divider my={8} borderColor="gray.500" />
      <Flex justifyContent="space-between" align="center">
        <Heading size="md">Send Funds</Heading>
        <Button size="sm" colorScheme="blue" onClick={onSendFundsOpen}>
          Send
        </Button>
      </Flex>
    </Box>
  );
};
