import { Fragment } from "react";
import {
  Container,
  Flex,
  Stack,
  VStack,
  Icon,
  Divider,
  useColorModeValue,
  Avatar,
  Text,
  Heading,
  Button,
  Badge,
} from "@chakra-ui/react";

interface Notification {
  dateAdded: string;
  contractName: string;
  contractAddress: string;
  isCustom: boolean;
  logo?: string;
}

const notifications: Notification[] = [
  {
    dateAdded: "yesterday",
    contractName: `<span style="font-weight: 600">Compound</span>`,
    contractAddress: "0x1234...5678",
    isCustom: false,
    logo: "/logos/compound-logo.png",
  },
  {
    dateAdded: "4 days ago",
    contractName: `<span style="font-weight: 600">Aave</span>`,
    contractAddress: "0x1234...5678",
    isCustom: false,
    logo: "/logos/aave-logo.png",
  },
  {
    dateAdded: "September 1st at 11:09 AM",
    contractName: `<span style="font-weight: 600">Family Contract</span>`,
    contractAddress: "0x1234...5678",
    isCustom: true,
  },
];

const StakingContracts = () => {
  return (
    <Container maxW="5xl" bg={useColorModeValue("gray.100", "gray.900")}>
      <Flex justify="space-between" my="1rem" align="center">
        <Heading as="h3" size="sm" color="white">
          Staking Contracts
        </Heading>
        <Button size="xs" colorScheme="blue" variant="outline">
          View All
        </Button>
      </Flex>
      <VStack
        boxShadow={useColorModeValue(
          "2px 6px 8px rgba(160, 174, 192, 0.6)",
          "2px 6px 8px rgba(9, 17, 28, 0.9)"
        )}
        bg={useColorModeValue("gray.100", "gray.800")}
        rounded="md"
        overflow="hidden"
        spacing={0}
        mb={5}
      >
        {notifications.map((notification, index) => (
          <Fragment key={index}>
            <Flex
              w="100%"
              justify="space-between"
              alignItems="center"
              _hover={{ bg: "gray.600" }}
              cursor="pointer"
            >
              <Stack spacing={0} direction="row" alignItems="center">
                <Flex p={4}>
                  <Avatar
                    size="md"
                    name={notification.contractName}
                    src={notification.logo || "/logos/ethereum-logo.png"}
                  />
                </Flex>
                <Flex direction="column" p={2}>
                  <Text
                    fontSize={{ base: "sm", sm: "md", md: "lg" }}
                    dangerouslySetInnerHTML={{
                      __html: notification.contractName,
                    }}
                  />
                  <Text fontSize={{ base: "sm", sm: "md" }}>
                    {notification.dateAdded}
                  </Text>
                </Flex>
              </Stack>
              {notification.isCustom && (
                <Badge
                  colorScheme="green"
                  variant="outline"
                  fontSize={{ base: "xs", sm: "sm" }}
                  px={2}
                  borderRadius={5}
                  mr={5}
                >
                  Custom
                </Badge>
              )}
            </Flex>
            {notifications.length - 1 !== index && <Divider m={0} />}
          </Fragment>
        ))}
      </VStack>
    </Container>
  );
};

export default StakingContracts;
