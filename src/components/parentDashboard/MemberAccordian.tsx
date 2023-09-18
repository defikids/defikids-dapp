import { User } from "@/data-schema/types";
import { trimAddress } from "@/utils/web3";
import { DeleteIcon } from "@chakra-ui/icons";
import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  Switch,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { NetworkType } from "@/data-schema/enums";

const MemberAccordian = ({ userDetails }: { userDetails: User }) => {
  const toast = useToast();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (userDetails.children?.length) {
      const fetchMembers = async () => {
        //@ts-ignore
        for (const memberAddress of userDetails.children) {
          try {
            const response = await axios.get(
              `/api/vercel/get-json?key=${memberAddress}`
            );
            const user = response.data;

            if (ethers.utils.isAddress(user.wallet)) {
              setUsers((users) => [...users, user]);
            }
          } catch (error) {
            console.error("Error fetching user:", error);
          }
        }
      };

      fetchMembers();
    }
  }, [userDetails]);

  console.log("userDetails", userDetails);
  console.log("users", users);

  if (userDetails.children) {
    return (
      <Heading size="sm" textAlign="center" mt={4}>
        You have no members in your family yet.
      </Heading>
    );
  }

  return (
    <Accordion allowToggle>
      {users.map((user, index) => (
        <AccordionItem key={index}>
          {({ isExpanded }) => (
            <>
              <AccordionButton
                _expanded={{ bg: "gray.200", color: "black" }}
                _focus={{ boxShadow: "none" }}
                _hover={{ bg: "gray.100", color: "black" }}
                borderTopRadius={5}
                borderBottom={isExpanded ? "none" : "1px solid"}
              >
                <Flex align="center" w="100%" justify="space-between">
                  <Avatar
                    size="md"
                    name={user?.username}
                    src={user?.avatarURI || ""}
                  />
                  <Text fontWeight="bold" fontSize="sm">
                    {user?.username}
                  </Text>
                  <Text fontSize="sm">{user?.account?.memberSince}</Text>
                </Flex>
              </AccordionButton>
              <AccordionPanel>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Address</Th>
                      <Th>Mode</Th>
                      <Th>Delete</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    <Tr>
                      <Td>
                        <Tooltip
                          label="Copy to clipboard"
                          aria-label="A tooltip"
                        >
                          <Text
                            cursor="pointer"
                            onClick={() => {
                              navigator.clipboard.writeText(user?.wallet);
                              toast({
                                title: "Copied to clipboard",
                                status: "success",
                              });
                            }}
                          >
                            {trimAddress(user?.wallet)}
                          </Text>
                        </Tooltip>
                      </Td>
                      <Td>
                        <Switch
                          colorScheme="teal"
                          size="md"
                          isChecked={
                            user?.defaultNetworkType === NetworkType.TESTNET
                              ? true
                              : false
                          }
                          onChange={() => {
                            // Update the sandboxMode state for the specific user
                            const updatedUsers = [...users];
                            updatedUsers[index].defaultNetworkType ===
                            NetworkType.MAINNET
                              ? NetworkType.TESTNET
                              : NetworkType.MAINNET;

                            setUsers(updatedUsers);
                          }}
                        />
                        <span
                          style={{
                            marginLeft: ".5rem",
                            fontSize: "0.8rem",
                          }}
                        >
                          {user?.defaultNetworkType === NetworkType.TESTNET
                            ? "Sandbox"
                            : "Mainnet"}
                        </span>
                      </Td>
                      <Td>
                        <Flex justify="center">
                          <DeleteIcon
                            style={{
                              cursor: "pointer",
                              fontSize: "1.2rem",
                              marginBottom: "0.3rem",
                            }}
                          />
                        </Flex>
                      </Td>
                    </Tr>
                  </Tbody>
                </Table>
              </AccordionPanel>
            </>
          )}
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default MemberAccordian;
