import { Fragment, useEffect, useState } from "react";
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
import { useAuthStore } from "@/store/auth/authStore";
import shallow from "zustand/shallow";
import { User } from "@/data-schema/types";
import { dateInSecondsToLongDate } from "@/utils/dateTime";

const RecentMemberActivity = ({ members }: { members: User[] }) => {
  const [activity, setActivity] = useState([]);

  const { userDetails } = useAuthStore(
    (state) => ({
      userDetails: state.userDetails,
    }),
    shallow
  );

  useEffect(() => {
    const getData = async () => {
      const res = await fetch(
        `/api/vercel/get-all-recent-activity?key=${userDetails.wallet}`
      );
      let data = await res.json();
      data = Object.entries(data).reverse().slice(0, 6);
      setActivity(data);
    };

    if (!userDetails.wallet) return;
    getData();
  }, [userDetails.wallet]);

  const parseUser = (wallet: string) => {
    const member = members.find((m) => m.wallet === wallet);
    const username = member ? member.username : userDetails.username;
    const avatar = member ? member.avatarURI : userDetails.avatarURI;
    return { username, avatar };
  };

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
        mb="2.5rem"
      >
        {activity.map(([timestamp, record]: [string, string], index) => (
          <Fragment key={index}>
            <Flex w="100%" justify="space-between" alignItems="center">
              <Stack spacing={0} direction="row" alignItems="center">
                <Flex p={4}>
                  <Avatar
                    size="md"
                    name={parseUser(record.split("::")[0]).username}
                    src={parseUser(record.split("::")[0]).avatar}
                  />
                </Flex>
                <Flex direction="column" p={2}>
                  <Heading
                    fontSize={{ base: "sm", sm: "md", md: "lg" }}
                    dangerouslySetInnerHTML={{
                      __html: parseUser(record.split("::")[0]).username,
                    }}
                  />
                  <Text
                    fontSize={{ base: "sm", sm: "md", md: "lg" }}
                    dangerouslySetInnerHTML={{
                      __html: record.split("::")[1],
                    }}
                  />
                  <Text fontSize={{ base: "sm", sm: "md" }}>
                    {dateInSecondsToLongDate(timestamp)}
                  </Text>
                </Flex>
              </Stack>
            </Flex>
            <Divider m={0} />
          </Fragment>
        ))}
      </VStack>
    </Container>
  );
};

export default RecentMemberActivity;
