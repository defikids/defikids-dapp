/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Flex,
  Heading,
  useToast,
  Text,
  Image,
  Button,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import jwt from "jsonwebtoken";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSignMessage, useAccount } from "wagmi";
import { ethers } from "ethers";
import { CustomConnectButton } from "@/components/ConnectButton";
import { User } from "@/dataSchema/types";

const ConfirmEmail = () => {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [decodedWalletAddress, setDecodedWalletAddress] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);
  const [initialUseCheck, setInitialUseCheck] = useState(false);

  const router = useRouter();
  const { token } = useRouter().query as { token: string };
  const toast = useToast();
  const { data: signature, error, signMessage } = useSignMessage();
  const { address, isDisconnected } = useAccount();

  const message = "Confirm Email Address";

  const redirectUser = () => {
    let count = 5;

    // Countdown function
    const countdown = () => {
      if (count === 0) {
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

  const updateUserEmailVerified = async (
    address: string,
    emailVerified: boolean
  ) => {
    const body = {
      ...user,
      emailVerified,
    };

    const payload = {
      key: address,
      value: body,
    };

    await axios.post(`/api/vercel/set-json`, payload);

    setEmailVerified(true);
    redirectUser();
  };

  /*
  This useEffect is use to update the user's emailVerified status in the database after the signature is verified.
  */
  useEffect(() => {
    const verifyToken = async () => {
      try {
        setIsConfirmed(false);

        const verified =
          decodedWalletAddress ===
          ethers.utils.verifyMessage(message, signature);

        if (verified) {
          await updateUserEmailVerified(decodedWalletAddress, true);
        } else {
          throw new Error("Verification failed");
        }
      } catch (err) {
        console.error("Error during verification:", err);
        toast({
          title: "Verification Failed",
          description: "Please contact DefiKids support for assistance.",
          status: "error",
        });
      }
    };

    if (signature) {
      verifyToken();
    }
  }, [signature]);

  /*
  This useEffect is used to sign the message when the user clicks the "Confirm Email" button.
  */
  useEffect(() => {
    if (!address) return;
    if (!isConfirmed) return;

    if (!signature) {
      try {
        signMessage({
          message,
        });
      } catch (err) {
        setIsConfirmed(false);
        console.error(err);
        toast({
          title: "Verification Failed",
          description: "Signature is required to confirm email.",
          status: "error",
        });
      }
    }
  }, [isConfirmed]);

  /*
  This useEffect is used to check if the user has already verified their email address.
  If they have, then we redirect them to the app.
  */
  useEffect(() => {
    if (!token && !initialUseCheck && !isDisconnected) return;

    const decodeJwt = async () => {
      setInitialUseCheck(true);
      try {
        jwt.verify(
          token,
          process.env.NEXT_PUBLIC_JWT_SECRET,
          async (err, decodedToken) => {
            if (err) {
              throw err;
            } else {
              const { walletAddress } = decodedToken as {
                walletAddress: string;
              };

              setDecodedWalletAddress(walletAddress);

              const user = await axios.get(
                `/api/vercel/get-json?key=${walletAddress}`
              );

              console.log("user", user.data);
              setUser(user.data);

              if (user.data?.emailVerified) {
                redirectUser();
              }
            }
          }
        );
      } catch (err) {
        console.error(err);
      }
    };

    decodeJwt();
  }, [token]);

  /*
  This useEffect is used to check if there is an error during the signing process.
  If there is, then we display an error message.
  */
  useEffect(() => {
    if (!error) return;
    if (error.cause) {
      setIsConfirmed(false);
      setDisabled(false);

      console.error("Error during verification:", error);
      toast({
        title: "Verification Failed",
        description: "Signature is required to confirm email.",
        status: "error",
      });
    }
  }, [error]);

  const Logo = () => {
    return (
      <Flex
        align="center"
        cursor="pointer"
        onClick={() => {
          router.push("/");
        }}
        ml={5}
        mt={5}
      >
        <Image src={"/pig_logo.png"} alt="Loader" width="50" height="50" />

        <Heading size="lg" ml={5}>
          Defikids
        </Heading>
      </Flex>
    );
  };

  if (emailVerified || user?.emailVerified) {
    return (
      <Box h="100vh">
        {Logo()}
        <Flex direction="column" align="center" justify="center" h="90vh">
          <Heading size={"lg"}>Email Confirmed!</Heading>
          <Text my={5} color="gray" fontSize="lg">
            Your email address was successfully authenticated.
          </Text>
          <Text my={5} color="gray" fontSize="lg">
            {`Your will be redirected to the DefiKids app in ${countdown} seconds.`}
          </Text>
        </Flex>
      </Box>
    );
  }

  if (
    user &&
    !user?.emailVerified &&
    address &&
    decodedWalletAddress &&
    !signature
  ) {
    return (
      <Box>
        {Logo()}
        <Flex direction="column" align="center" justify="center" height="100vh">
          <Button
            mb="10rem"
            onClick={() => {
              if (!disabled) {
                setIsConfirmed(true);
                setDisabled(true);
              }
            }}
            colorScheme="gray"
            size="lg"
            style={{
              cursor: `${disabled ? "not-allowed" : "pointer"}`,
              borderRadius: "10px",
              padding: "15px",
            }}
          >
            <Text fontSize={"lg"}>
              {!signature && !isConfirmed
                ? "Confirm Email"
                : "Signing Message..."}
            </Text>
          </Button>
        </Flex>
      </Box>
    );
  }

  return (
    <Box h="100vh">
      {Logo()}
      <Flex direction="column" align="center" justify="center" height="100vh">
        <Box mb="10rem">
          <CustomConnectButton />
        </Box>
      </Flex>
    </Box>
  );
};

export default ConfirmEmail;
