import { Fragment } from "react";
import {
  Container,
  Flex,
  Stack,
  VStack,
  Divider,
  useColorModeValue,
  Avatar,
  Text,
  Heading,
  Button,
} from "@chakra-ui/react";

interface Activity {
  activity: string;
  dateTime: string;
  userName: string;
  userAvatar: string;
}

const memberActivity: Activity[] = [
  {
    activity: `<span style="font-weight: 600">Dan Abrahmov</span> Updated Avatar.`,
    dateTime: "September 10th at 9:10 AM",
    userName: "Dan Abrahmov",
    userAvatar: "https://bit.ly/dan-abramov",
  },
  {
    activity: `<span style="font-weight: 600">Kent Dodds</span> Staked 1.5 ETH.`,
    dateTime: "yesterday",
    userName: "Kent Dodds",
    userAvatar: "https://bit.ly/kent-c-dodds",
  },
  {
    activity: `<span style="font-weight: 600">Jena Karlis</span> Timelocked 5 ETH.`,
    dateTime: "4 days ago",
    userName: "Jena Karlis",
    userAvatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=334&q=80",
  },
  {
    activity: `<span style="font-weight: 600">Jena Karlis</span> Staked 2 ETH.`,
    dateTime: "4 days ago",
    userName: "Jena Karlis",
    userAvatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=334&q=80",
  },
  {
    activity: `<span style="font-weight: 600">Jena Karlis</span> Updated Avatar.`,
    dateTime: "4 days ago",
    userName: "Jena Karlis",
    userAvatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=334&q=80",
  },
  {
    activity: `<span style="font-weight: 600">Kent Dodds</span> Claimed 1.5 ETH in staking rewards.`,
    dateTime: "5 days ago",
    userName: "Kent Dodds",
    userAvatar: "https://bit.ly/kent-c-dodds",
  },
];

const RecentMemberActivity = () => {
  return (
    <Container maxW="5xl" bg={useColorModeValue("gray.100", "gray.900")}>
      <Flex justify="space-between" my="1rem" align="center">
        <Heading as="h3" size="sm" color="white">
          Recent Activity
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
        my="2.5rem"
      >
        {memberActivity.map((activity, index) => (
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
                    name={activity.userName}
                    src={activity.userAvatar || ""}
                  />
                </Flex>
                <Flex direction="column" p={2}>
                  <Text
                    fontSize={{ base: "sm", sm: "md", md: "lg" }}
                    dangerouslySetInnerHTML={{
                      __html: activity.activity,
                    }}
                  />
                  <Text fontSize={{ base: "sm", sm: "md" }}>
                    {activity.dateTime}
                  </Text>
                </Flex>
              </Stack>
            </Flex>
            {memberActivity.length - 1 !== index && <Divider m={0} />}
          </Fragment>
        ))}
      </VStack>
    </Container>
  );
};

export default RecentMemberActivity;
