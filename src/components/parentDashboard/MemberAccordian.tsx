import { User } from "@/data-schema/types";
import { trimAddress } from "@/utils/web3";
import { DeleteIcon } from "@chakra-ui/icons";
import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Avatar,
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
import { NetworkType } from "@/data-schema/enums";
import { useState } from "react";
import axios from "axios";

const MemberAccordian = ({
  userDetails,
  users,
  setUsers,
}: {
  userDetails: User;
  users: User[];
  setUsers: (users: User[]) => void;
}) => {
  const toast = useToast();

  const [toggleSwitch, setToggleSwitch] = useState(false);

  if (userDetails.children && userDetails.children.length === 0) {
    return (
      <Heading size="sm" textAlign="center" mt={4}>
        You have no members in your family yet.
      </Heading>
    );
  }

  const updateMemberSandbox = async () => {
    //! REVIEW SANDBOX BUTTON ON MAIN MENU
    try {
      const body = {
        ...userDetails,
        sandboxMode: toggleSwitch,
      };

      const payload = {
        key: userDetails?.wallet,
        value: body,
      };

      await axios.post(`/api/vercel/set-json`, payload);

      toast({
        title: "Username successfully updated",
        status: "success",
      });
    } catch (e) {
      console.error(e);
    }
  };

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
                    name={user?.username || trimAddress(user?.wallet)}
                    src={user?.avatarURI}
                  />
                  <Text fontWeight="bold" fontSize="lg" color="black">
                    {user?.username || trimAddress(user?.wallet)}
                  </Text>
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
                          isChecked={toggleSwitch}
                          onChange={() => {
                            // Update the sandboxMode state for the specific user
                            const updatedUsers = [...users];

                            updatedUsers[index].defaultNetworkType ===
                            NetworkType.MAINNET
                              ? setToggleSwitch(true)
                              : setToggleSwitch(false);

                            // updatedUsers[index].defaultNetworkType ===
                            // NetworkType.MAINNET
                            //   ? NetworkType.TESTNET
                            //   : NetworkType.MAINNET;

                            // const selectedNetwork =
                            //   updatedUsers[index].defaultNetworkType ===
                            //   NetworkType.MAINNET
                            //     ? NetworkType.TESTNET
                            //     : NetworkType.MAINNET;

                            updateMemberSandbox();
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
