"use client";

/* eslint-disable react-hooks/exhaustive-deps */

import {
  Box,
  Flex,
  Heading,
  Text,
  Image,
  Button,
  Center,
  Container,
} from "@chakra-ui/react";
import { usePathname } from "next/navigation";
import jwt from "jsonwebtoken";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useAccount } from "wagmi";
import { CustomConnectButton } from "@/components/ConnectButton";
import { User } from "@/data-schema/types";
import { UserType } from "@/data-schema/enums";
import { trimAddress } from "@/utils/web3";
import { useAuthStore } from "@/store/auth/authStore";
import shallow from "zustand/shallow";

interface DecodedToken {
  parentAddress: string;
  sandboxMode: boolean;
  familyId: string;
  familyName: string;
  email: string;
  exp: number;
}

const MemberInvite = () => {
  const [countdown, setCountdown] = useState(5);
  const [initialUserCheck, setInitialUserCheck] = useState(false);
  const [decodedData, setDecodedData] = useState<DecodedToken | null>(null);
  const [inviteAccepted, setInviteAccepted] = useState(false);

  const pathname = usePathname();
  const token = useMemo(() => {
    return pathname?.split("/")[2];
  }, [pathname]);

  console.log("token", token);
  const { address, isDisconnected } = useAccount();
  const [inviteNonExistent, setInviteNonExistent] = useState(false);

  const { walletConnected, setUserDetails } = useAuthStore(
    (state) => ({
      walletConnected: state.walletConnected,
      setUserDetails: state.setUserDetails,
    }),
    shallow
  );

  const updateParent = async (decodedToken: DecodedToken) => {
    if (!decodedToken) return;

    try {
      const { parentAddress } = decodedToken;

      const parent = await axios.get(
        `/api/vercel/get-json?key=${parentAddress}`
      );

      // Update parent's children and remove invitation
      const parentUser = parent.data as User;

      // Check if the address is not already in the children array
      if (!parentUser.children.includes(address)) {
        parentUser.children.push(address);
      }

      const body = {
        ...parentUser,
        invitations: parentUser.invitations.filter(
          (email) => email !== decodedToken.email
        ),
      };

      const payload = {
        key: parentAddress,
        value: body,
      };

      await axios.post(`/api/vercel/set-json`, payload);
    } catch (err) {
      console.error(err);
    }
  };

  const createMember = async (decodedToken: DecodedToken) => {
    if (!decodedToken) return;

    const { sandboxMode, familyId, familyName, email } = decodedToken;

    try {
      const body = {
        familyName,
        familyId,
        email,
        username: "",
        avatarURI: "",
        backgroundURI: "",
        opacity: {
          background: 1,
          card: 1,
        },
        userType: UserType.CHILD,
        memberSince: Date.now(),
        wallet: address,
        sandboxMode,
      };

      const payload = {
        key: address,
        value: body,
      };

      await axios.post(`/api/vercel/set-json`, payload);
    } catch (err) {
      console.error(err);
    }
  };

  const redirectUser = async () => {
    let count = 5;

    // Countdown function
    const countdown = async () => {
      if (count === 0) {
        const updatedUserDetails = await axios.get(
          `/api/vercel/get-json?key=${address}`
        );

        setUserDetails(updatedUserDetails.data);
        router.push("/");
      } else {
        setTimeout(() => {
          count--;
          setCountdown(count);
          countdown();
        }, 1000);
      }
    };

    countdown(); // Start the countdown
  };

  const handleToken = async () => {
    if (!token && !initialUserCheck && !isDisconnected) return;

    setInitialUserCheck(true);
    try {
      jwt.verify(
        token,
        process.env.NEXT_PUBLIC_JWT_SECRET,
        async (err, decodedToken) => {
          if (err) {
            throw err;
          } else {
            // check if invite still exists
            const { exp } = decodedToken as DecodedToken;
            if (exp < Math.floor(Date.now() / 1000)) {
              setInviteNonExistent(true);
              return;
            }
            setDecodedData(decodedToken as DecodedToken);
          }
        }
      );
    } catch (err) {
      console.error(err);
    }
  };

  const Logo = () => {
    return (
      <Flex align="center" ml={5} mt={5}>
        <Image src={"/pig_logo.png"} alt="Loader" width="50" height="50" />

        <Heading size="lg" ml={5}>
          Defikids
        </Heading>
      </Flex>
    );
  };

  useEffect(() => {
    if (!decodedData) return;

    const inviteAlreadyAccepted = async () => {
      const user = await axios.get(
        `/api/vercel/get-json?key=${decodedData?.parentAddress}`
      );

      // check if invite still exists
      if (!user?.data?.invitations.includes(decodedData?.email)) {
        setInviteNonExistent(true);
        return;
      }

      //update DB
      await updateParent(decodedData);
      await createMember(decodedData);

      // set invite accepted
      setInviteAccepted(true);
      redirectUser();
    };

    inviteAlreadyAccepted();
  }, [decodedData]);

  if (inviteAccepted) {
    return (
      <Box h="100vh">
        {Logo()}
        <Flex direction="column" align="center" justify="center" h="90vh">
          <Heading size={"lg"}>Invite Accepted!</Heading>
          <Text my={5} color="gray" fontSize="lg">
            Your account was successfully created.
          </Text>
          <Text my={5} color="gray" fontSize="lg">
            {`Your will be redirected to the DefiKids app in ${countdown} seconds.`}
          </Text>
        </Flex>
      </Box>
    );
  }

  if (inviteNonExistent) {
    return (
      <Box h="100vh">
        {Logo()}
        <Flex direction="column" align="center" justify="center" h="90vh">
          <Heading size={"lg"}>Invitation Expired</Heading>
          <Text my={5} color="gray" fontSize="lg">
            Request a new invite.
          </Text>
        </Flex>
      </Box>
    );
  }

  if (!walletConnected) {
    return (
      <Box h="100vh">
        {Logo()}
        <Flex direction="column" align="center" justify="center" height="100vh">
          <Container size="lg" mb="10rem">
            <Heading textAlign="center" size={"lg"}>
              Welcome
            </Heading>

            <Text my={5} textAlign="center">
              You have been invited to join a DefiKids family. To accept this
              invitation, please connect your wallet.
            </Text>
            <Center mt="5rem">
              <CustomConnectButton />
            </Center>
          </Container>
        </Flex>
      </Box>
    );
  }

  return (
    <Box h="100vh">
      {Logo()}
      <Flex direction="column" align="center" justify="center" height="100vh">
        <Container size="lg" mb="10rem">
          <Flex direction="column" justify="center">
            <Heading textAlign="center" size={"lg"}>{`Account ${trimAddress(
              address
            )}`}</Heading>
            <Text align="center" mt={5}>
              This is the account you are currently connected to and will be
              used to create your DefiKids account.
            </Text>
          </Flex>

          <Center mt={5}>
            <Button
              mt="3rem"
              colorScheme="gray"
              size="lg"
              style={{
                cursor: "pointer",
                borderRadius: "10px",
                padding: "15px",
              }}
              onClick={handleToken}
            >
              <Text fontSize={"lg"}>Accept Invitation</Text>
            </Button>
          </Center>
        </Container>
      </Flex>
    </Box>
  );
};

export default MemberInvite;
