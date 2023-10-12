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
  FormControl,
  Input,
  useToast,
} from "@chakra-ui/react";
import { usePathname, useRouter } from "next/navigation";
import jwt from "jsonwebtoken";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useAccount, useNetwork } from "wagmi";
import { CustomConnectButton } from "@/components/ConnectButton";
import { User } from "@/data-schema/types";
import { NetworkType, UserType } from "@/data-schema/enums";
import { useAuthStore } from "@/store/auth/authStore";
import shallow from "zustand/shallow";
import { PermissionType } from "@/data-schema/enums";
import { IUser } from "@/models/User";
import {
  createUser,
  getUserByWalletAddress,
} from "@/services/mongo/routes/user";
import { createActivity } from "@/services/mongo/routes/activity";
import {
  deleteInvitation,
  getInvitation,
} from "@/services/mongo/routes/invitation";
import { TestnetNetworks } from "@/data-schema/enums";
import mongoose from "mongoose";
import { convertTimestampToSeconds } from "@/utils/dateTime";

interface DecodedToken {
  accountId: mongoose.Schema.Types.ObjectId;
  parentAddress: string;
  sandboxMode: boolean;
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
  const router = useRouter();
  const toast = useToast();

  const token = useMemo(() => {
    return pathname?.split("/")[2];
  }, [pathname]);

  const { address, isDisconnected } = useAccount() as any;
  const { chain } = useNetwork();
  const [inviteNonExistent, setInviteNonExistent] = useState(false);
  const [username, setUsername] = useState("");

  const { setUserDetails, userDetails, reset } = useAuthStore(
    (state) => ({
      setUserDetails: state.setUserDetails,
      userDetails: state.userDetails,
      reset: state.reset,
    }),
    shallow
  );

  const createMember = async (decodedToken: DecodedToken) => {
    if (!decodedToken) return;

    const { email, accountId } = decodedToken;
    console.log("createMember - userDetails", userDetails);
    try {
      let userPayload = {
        accountId,
        termsAgreed: true,
        email,
        defaultNetwork: TestnetNetworks.GOERLI,
        defaultNetworkType: NetworkType.TESTNET,
        wallet: address,
        username,
        userType: UserType.MEMBER,
        sandboxMode: false,
        permissions: [...Object.values(PermissionType)],
      } as IUser;

      const user = await createUser(userPayload);
      const error = user.response?.data?.error || user.error;

      if (error) {
        toast({
          description: "Database error. Please try again later.",
          status: "error",
        });
        throw new Error(error);
      }

      await createActivity({
        accountId,
        wallet: address,
        date: convertTimestampToSeconds(Date.now()),
        type: "Invitation Accepted.",
      });
    } catch (err) {
      console.error(err);
    }
  };

  const redirectUser = async () => {
    let count = 5;

    // Countdown function
    const countdown = async () => {
      if (count === 0) {
        const updatedUserDetails = await getUserByWalletAddress(address);
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
    if (!username) {
      toast({
        title: "Error",
        description: "Please enter a username.",
        status: "error",
      });
      return;
    }

    if (!token && !initialUserCheck && !isDisconnected) return;

    setInitialUserCheck(true);
    try {
      jwt.verify(
        token!,
        process.env.NEXT_PUBLIC_JWT_SECRET || "",
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
        <Image
          src={"/logos/pig_logo.png"}
          alt="Loader"
          width="50"
          height="50"
        />

        <Heading size="lg" ml={5}>
          Defikids
        </Heading>
      </Flex>
    );
  };

  // Reset store on page load
  useEffect(() => {
    reset();
  }, []);

  // Check if wallet has already been registered and if invite has already been accepted
  useEffect(() => {
    if (!decodedData) return;

    if (!address) return;

    const verifyUser = async () => {
      const { accountId, email } = decodedData;
      try {
        const user = await getUserByWalletAddress(address);
        const invitation = await getInvitation(accountId!, email);

        if (user.response?.statusText !== "Not Found") {
          toast({
            title: "Error",
            description: "Wallet already registered.",
            status: "error",
          });
          return;
        }

        if (!invitation) {
          setInviteNonExistent(true);
          return;
        }

        await createMember(decodedData);
        await deleteInvitation(invitation._id);

        setInviteAccepted(true);
        redirectUser();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    verifyUser();
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

  if (!address) {
    return (
      <Box h="100vh">
        {Logo()}
        <Flex direction="column" align="center" justify="center" height="100vh">
          <Container size="lg" mb="10rem">
            <Heading textAlign="center" size={"lg"}>
              Welcome
            </Heading>

            <Text my={5} textAlign="center">
              {`You have been invited to join a DefiKids family. To accept this
              invitation, please connect your
              wallet.`}
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
            {chain?.unsupported ? (
              <Text align="center" my={5}>
                Your wallet is currently connected to an unsupported network.
                Click the button below to change networks.
              </Text>
            ) : (
              <Text align="center" my={5}>
                This is the wallet you are currently connected to and will be
                used to create your DefiKids account.
              </Text>
            )}
            <Center>
              <CustomConnectButton />
            </Center>
          </Flex>

          {/* username */}
          {!chain?.unsupported && (
            <>
              <Flex direction="row" align="center" mt="3rem" mx={5}>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Create a username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    _hover={{
                      borderColor: "gray.300",
                    }}
                    _focus={{
                      borderColor: "blue.500",
                    }}
                    sx={{
                      "::placeholder": {
                        color: "gray.400",
                      },
                    }}
                  />
                </FormControl>
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
            </>
          )}
        </Container>
      </Flex>
    </Box>
  );
};

export default MemberInvite;
