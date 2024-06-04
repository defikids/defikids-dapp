import { User } from "@/data-schema/types";
import {
  Container,
  Flex,
  useColorModeValue,
  Text,
  Heading,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { stable_coin_symbol } from "@/config";

interface Notification {
  title: string;
  value: string;
  unit: string;
}

const FamilyStatistics = ({ members }: { members: User[] }) => {
  const totalActiveAllowances: number = members.reduce(
    (acc: number, member: User) => {
      const balanceAsNumber =
        typeof member.balance === "number"
          ? member.balance
          : parseFloat(member.balance!) || 0;
      return acc + balanceAsNumber;
    },
    0
  );

  const stats: Notification[] = [
    {
      title: "Members",
      value: members.length.toString(),
      unit: "",
    },
    {
      title: "Total Active Allowances",
      value: totalActiveAllowances.toString(),
      unit: stable_coin_symbol,
    },
    {
      title: "Rewards Earned",
      value: "5",
      unit: "ETH",
    },
    {
      title: "Custom Contracts",
      value: "7",
      unit: "",
    },
  ];
  return (
    <Container maxW="5xl" bg={useColorModeValue("gray.100", "gray.900")}>
      <Flex justify="space-between" my="1rem" align="center">
        <Heading as="h3" size="sm" color="white">
          Family Statistics
        </Heading>
      </Flex>
      <Grid
        templateRows="repeat(2, 1fr)"
        templateColumns="repeat(2, 1fr)"
        gap={4}
        rounded="md"
        overflow="hidden"
        my="2rem"
      >
        {stats.map((stat, index) => (
          <GridItem key={index} bg="gray.800" borderRadius="md" p={4}>
            <Text fontSize="sm">{stat.title}</Text>
            <Text
              fontSize={{ base: "sm", sm: "md", md: "2xl" }}
              color="primary"
              fontWeight="bold"
            >
              {stat.value} {stat.unit}
            </Text>
          </GridItem>
        ))}
      </Grid>
    </Container>
  );
};

export default FamilyStatistics;
