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
import { UserType } from "@/data-schema/enums";
import { trimAddress } from "@/utils/web3";
import { useAuthStore } from "@/store/auth/authStore";
import shallow from "zustand/shallow";
import { PermissionType } from "@/data-schema/enums";

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
  const router = useRouter();
  const toast = useToast();

  const token = useMemo(() => {
    return pathname?.split("/")[2];
  }, [pathname]);

  const { address, isDisconnected } = useAccount() as any;
  const { chain } = useNetwork();
  console.log("chain", chain);
  const [inviteNonExistent, setInviteNonExistent] = useState(false);
  const [username, setUsername] = useState("");
  const [validWallet, setValidWallet] = useState(false);

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
      if (parentUser.children && !parentUser.children.includes(address)) {
        parentUser.children.push(address);
      }

      const body = {
        ...parentUser,
        //@ts-ignore
        invitations: parentUser.invitations.filter(
          (obj) => obj.email !== decodedToken.email
        ),
      };

      const payload = {
        key: parentAddress,
        value: body,
      };

      console.log("parent payload", payload);
      return;

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
        username,
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
        permissions: {
          general: {
            avatar: PermissionType.ENABLED,
            email: PermissionType.ENABLED,
            username: PermissionType.ENABLED,
          },
        },
      };

      const payload = {
        key: address,
        value: body,
      };

      console.log("member payload", payload);
      return;

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

  useEffect(() => {
    if (!decodedData) return;

    const inviteAlreadyAccepted = async () => {
      const user = await axios.get(
        `/api/vercel/get-json?key=${decodedData?.parentAddress}`
      );

      // check if invite still exists
      const emailExists = user.data.invitations?.some(
        (obj: User) => obj.email === decodedData?.email
      );
      if (!emailExists) {
        setInviteNonExistent(true);
        return;
      }

      //update DB
      await updateParent(decodedData);
      await createMember(decodedData);
      return;

      // set invite accepted
      setInviteAccepted(true);
      redirectUser();
    };

    inviteAlreadyAccepted();
  }, [decodedData]);

  useEffect(() => {
    const fetchData = async () => {
      console.log("address", address);
      if (!address) return;

      try {
        const response = await axios.get(`/api/vercel/get-all-keys`);
        const addresses = response.data;

        console.log("addresses", addresses);

        if (addresses.includes(address)) {
          setValidWallet(false);
          toast({
            title: "Error",
            description: "Wallet already registered.",
            status: "error",
          });
        } else {
          setValidWallet(true);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [walletConnected]);

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
            {/* <Heading textAlign="center" size={"lg"}>{`Account ${
              address ? trimAddress(address) : "not found"
            }`}</Heading> */}

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
