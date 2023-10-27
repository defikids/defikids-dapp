"use client";

import React, { Fragment, useEffect, useState } from "react";
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
import { getActivityByAccount } from "@/BFF/mongo/getActivityByAccount";
import { IActivity } from "@/models/Activity";
import { getFamilyMembersByAccount } from "@/BFF/mongo/getFamilyMembersByAccount";
import { IUser } from "@/models/User";
import { formatDateToIsoString } from "@/utils/dateTime";
import { User } from "@/data-schema/types";

interface FormattedActivity {
  activityText: string;
  dateTime: number;
  userName: string;
  userAvatar: string;
}

export const RecentMemberActivity = ({ user }: { user: User }) => {
  const [memberActivity, setMemberActivity] = useState<FormattedActivity[]>([]);

  useEffect(() => {
    const getData = async () => {
      const data = (await getActivityByAccount(user.accountId!)) as IActivity[];
      const members = (await getFamilyMembersByAccount(
        user.accountId!,
        true
      )) as IUser[];

      const previewData = data.slice(0, 5);

      const formattedActivity = previewData.map((activity: IActivity) => {
        if (user.accountId === activity.accountId) {
          const member = members.find((m) => m.wallet === activity.wallet);

          if (member) {
            return {
              activityText: `<span style="font-weight: 600">${member?.username}</span> ${activity.type}`,
              dateTime: activity.date,
              userName: member?.username || "",
              userAvatar: member?.avatarURI || "",
            };
          }
        }
      }) as FormattedActivity[];

      setMemberActivity(formattedActivity);
    };
    getData();
  }, []);

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
          <Fragment key={activity.dateTime}>
            <Flex w="100%" justify="space-between" alignItems="center">
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
                      __html: activity.activityText,
                    }}
                  />
                  <Text fontSize={{ base: "sm", sm: "md" }}>
                    {formatDateToIsoString(activity.dateTime)}
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
