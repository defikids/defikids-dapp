"use client";

import { IAccount } from "@/models/Account";
import { IActivity } from "@/models/Activity";
import { IInvitation } from "@/models/Invitation";
import { IUser } from "@/models/User";
import { getAllUsers } from "@/services/mongo/routes/user";
import { getAllAccounts } from "@/services/mongo/routes/account";
import { getAllActivity } from "@/services/mongo/routes/activity";
import { getAllInvitations } from "@/services/mongo/routes/invitation";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Container,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Input,
  Text,
  useToast,
} from "@chakra-ui/react";
import { Fragment, useEffect, useState } from "react";
import { getEtherscanUrl } from "@/utils/web3";
import { ethers } from "ethers";
import TokenLockerContract from "@/blockchain/tokenLockers";

const Admin = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [accounts, setAccounts] = useState<IAccount[]>([]);
  const [users, setUsers] = useState<IUser[]>([]);
  const [invitations, setInvitations] = useState<IInvitation[]>([]);
  const [activity, setActivity] = useState<IActivity[]>([]);

  const toast = useToast();

  interface Stats {
    title: string;
    value: string;
    unit: string;
  }

  const stats: Stats[] = [
    {
      title: "Users",
      value: users.length.toString(),
      unit: "",
    },
    {
      title: "Invitations",
      value: invitations.length.toString(),
      unit: "",
    },
    {
      title: "Accounts",
      value: accounts.length.toString(),
      unit: "",
    },
    {
      title: "Activity Events",
      value: activity.length.toString(),
      unit: "",
    },
  ];

  const tokenLockerActions = [
    {
      function: "removeLock",
      inputs: [
        {
          name: "lockerNumber",
          type: "number",
        },
        {
          name: "lockerOwner",
          type: "string",
        },
      ],
    },
    {
      function: "withdraw",
      inputs: [],
    },
  ];

  const writeMethod = async (methodName: string, index: number) => {
    let inputs: any = document.querySelectorAll(
      `[data-write=${methodName}_${index}]`
    );

    const parsedInputs = Array.from(inputs).map((input: any) => {
      return input.value;
    });

    try {
      // @ts-ignore
      const provider = new ethers.BrowserProvider(window.ethereum);
      const tokenLockerInstance = await TokenLockerContract.fromProvider(
        provider
      );
      const chainId = (await provider.getNetwork()).chainId;

      const tx = await tokenLockerInstance[methodName](...parsedInputs);
      toast({
        title: "Transaction Sent",
        description: `View on Etherscan: ${getEtherscanUrl(
          +chainId.toString(),
          "tx",
          tx.hash
        )}`,
        status: "success",
      });
    } catch (e) {
      console.log("error", e);
      toast({
        title: "Error",
        description: `${(e as Error).message}`,
        status: "error",
      });
    }
  };

  useEffect(() => {
    const getData = async () => {
      const accounts = await getAllAccounts();
      const users = await getAllUsers();
      const invitations = await getAllInvitations();
      const activity = await getAllActivity();

      setAccounts(accounts);
      setUsers(users);
      setInvitations(invitations);
      setActivity(activity);
    };
    getData();
  }, []);

  if (!isUnlocked) {
    return (
      <Box textAlign="center" mt="10rem">
        <Heading as="h1">Admin Page</Heading>
        <Text as="h2" cursor="pointer" onClick={() => setIsUnlocked(true)}>
          Under Construction
        </Text>
      </Box>
    );
  }

  return (
    <Container mt="10rem" textAlign="center">
      <Heading mb={3}>Admin Dashboard</Heading>

      <Grid
        templateRows="repeat(2, 1fr)"
        templateColumns="repeat(2, 1fr)"
        gap={4}
        rounded="md"
        overflow="hidden"
        my="2rem"
      >
        {stats.map((stat, index) => (
          <GridItem key={index} bg="gray.900" borderRadius="md" p={4}>
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

      <Heading mt="4rem" mb={3} size="sm">
        TokenLockers Contract - Owner Actions
      </Heading>

      <Accordion allowToggle>
        {tokenLockerActions.map((action, index) => (
          <AccordionItem key={index}>
            <h2>
              <AccordionButton>
                <Box as="span" flex="1" textAlign="left">
                  <Heading as="h3" size="md" color="white">
                    {action.function}
                  </Heading>
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              {action.inputs.map(({ name, type }, i) => (
                <Box key={name + i}>
                  <Fragment key={i}>
                    <FormLabel>{name}</FormLabel>
                    <Input
                      data-write={`${action.function}_${index}`}
                      type="text"
                      placeholder={type}
                      style={{
                        border: "1px solid lightgray",
                        marginBottom: "1rem",
                      }}
                      sx={{
                        "::placeholder": {
                          color: "gray.400",
                        },
                      }}
                    />
                  </Fragment>
                </Box>
              ))}
              <Button
                mt={4}
                size={"sm"}
                colorScheme="blue"
                onClick={() => {
                  writeMethod(action.function, index);
                }}
              >
                Submit
              </Button>
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </Container>
  );
};

export default Admin;
