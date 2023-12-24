/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { Fragment, useCallback, useEffect, useState } from "react";
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
import { useAuthStore } from "@/store/auth/authStore";
import { shallow } from "zustand/shallow";
import { getUserByWalletAddress } from "@/services/mongo/routes/user";

interface FormattedActivity {
  activityText: string;
  dateTime: number;
  userName: string;
  userAvatar: string;
}

export const RecentMemberActivity = ({ user }: { user: User }) => {
  const [memberActivity, setMemberActivity] = useState<FormattedActivity[]>([]);

  const { recentActivity, setRecentActivity } = useAuthStore(
    (state) => ({
      recentActivity: state.recentActivity,
      setRecentActivity: state.setRecentActivity,
    }),
    shallow
  );

  /* This useEffect is used to get the recent activity for the user upon page load */
  useEffect(() => {
    const getData = async () => {
      const activity = await getActivityByAccount(user?.accountId!);
      await normaliseActivity(activity);
    };
    if (user?.accountId) getData();
  }, []);

  /* This useEffect is used to update the recent activity when a user deposits or mints */
  useEffect(() => {
    const getData = async () => {
      await normaliseActivity(recentActivity);
      setRecentActivity([]);
    };
    if (recentActivity.length > 0) getData();
  }, [recentActivity]);

  const normaliseActivity = async (activities: IActivity[]) => {
    const members = (await getFamilyMembersByAccount(
      user.accountId!,
      true
    )) as IUser[];

    const formattedActivity = activities.map((activity: IActivity) => {
      const member = members.find((m) => m.wallet === activity?.wallet);

      return {
        activityText: `<span style="font-weight: 600">${member?.username}</span> ${activity?.type}`,
        dateTime: activity?.date,
        userName: member?.username || "",
        userAvatar: member?.avatarURI || "",
      };
    }) as FormattedActivity[];

    const previewData = [...formattedActivity, ...memberActivity].slice(0, 6);

    setMemberActivity(previewData);
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
        my="2.5rem"
      >
        {memberActivity.map((activity, index) => (
          <Fragment key={activity?.dateTime}>
            <Flex w="100%" justify="space-between" alignItems="center">
              <Stack spacing={0} direction="row" alignItems="center">
                <Flex p={4}>
                  <Avatar
                    size="md"
                    name={activity?.userName}
                    src={activity?.userAvatar || ""}
                  />
                </Flex>
                <Flex direction="column" p={2}>
                  <Text
                    fontSize={{ base: "sm", sm: "md", md: "lg" }}
                    dangerouslySetInnerHTML={{
                      __html: activity?.activityText,
                    }}
                  />
                  <Text fontSize={{ base: "sm", sm: "md" }}>
                    {formatDateToIsoString(activity?.dateTime)}
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
