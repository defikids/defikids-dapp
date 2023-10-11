"use client";

import { Box, Center, Heading, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import shallow from "zustand/shallow";
import { useAuthStore } from "@/store/auth/authStore";
import { useContractStore } from "@/store/contract/contractStore";
import { useBalance } from "wagmi";
import { getUserByWalletAddress } from "@/services/mongo/database";
import { IUser } from "@/models/User";

const MemberDashboard: React.FC = () => {
  //=============================================================================
  //                               STATE
  //=============================================================================

  const [member, setMember] = useState<IUser>();

  //=============================================================================
  //                               HOOKS
  //=============================================================================
  const { userDetails } = useAuthStore(
    (state) => ({
      userDetails: state.userDetails,
    }),
    shallow
  );

  const { connectedSigner } = useContractStore(
    (state) => ({
      connectedSigner: state.connectedSigner,
    }),
    shallow
  );

  const { data } = useBalance({
    address: userDetails?.wallet as `0x${string}`,
  });

  useEffect(() => {
    if (!userDetails?.wallet) return;

    const getMember = async () => {
      try {
        const member = await getUserByWalletAddress(userDetails?.wallet);
        setMember(member);
      } catch (error) {
        console.log("error", error);
      }
    };
    getMember();
  }, [userDetails?.wallet]);

  return (
    <Box mt={"10rem"}>
      <Center>
        <Heading>Member Dashboard</Heading>
      </Center>

      <Center>
        <Text>{member?.wallet}</Text>
      </Center>
    </Box>
  );
};

export default MemberDashboard;
