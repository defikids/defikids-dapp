import { User } from "@/data-schema/types";
import { trimAddress } from "@/utils/web3";
import { DeleteIcon } from "@chakra-ui/icons";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Avatar,
  Box,
  Flex,
  Heading,
  Select,
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
import shallow from "zustand/shallow";
import { useAuthStore } from "@/store/auth/authStore";

const MemberAccordian = ({
  users,
  setUsers,
}: {
  users: User[];
  setUsers: (users: User[]) => void;
}) => {
  const toast = useToast();

  const { userDetails } = useAuthStore(
    (state) => ({
      userDetails: state.userDetails,
    }),
    shallow
  );

  const [toggleSwitch, setToggleSwitch] = useState(false);

  if (userDetails.children && userDetails.children.length === 0) {
    return (
      <Heading size="sm" textAlign="center" mt={4}>
        You have no members in your family yet.
      </Heading>
    );
  }

  const updateMemberSandbox = async (user: User) => {
    try {
      const body = {
        ...user,
        sandboxMode: toggleSwitch,
      };

      const payload = {
        key: user?.wallet,
        value: body,
      };

      await axios.post(`/api/vercel/set-json`, payload);

      toast({
        title: "Mode successfully updated",
        status: "success",
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteMember = async (user: User) => {
    try {
      await axios.delete(`/api/vercel/delete-json-data?key=${user?.wallet}`);

      // remove the member from the parent's children array
      const body = {
        ...user,
        children: [
          //@ts-ignore
          ...userDetails.children.filter((address) => address !== user?.wallet),
        ],
      };

      const payload = {
        key: userDetails?.wallet,
        value: body,
      };

      await axios.post(`/api/vercel/set-json`, payload);

      toast({
        title: "Member successfully deleted",
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
                  <Flex align="center">
                    <Avatar
                      size="md"
                      name={user?.username || trimAddress(user?.wallet)}
                      src={user?.avatarURI}
                    />
                    <Text fontWeight="bold" fontSize="lg" color="black" ml={5}>
                      {user?.username || trimAddress(user?.wallet)}
                    </Text>
                  </Flex>
                  <AccordionIcon />
                </Flex>
              </AccordionButton>
              <AccordionPanel>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Address</Th>
                      <Th>Sandbox Mode</Th>
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
                        {userDetails.defaultNetworkType ===
                        NetworkType.TESTNET ? (
                          <Text>Testnet</Text>
                        ) : (
                          <Select
                            value={toggleSwitch ? "true" : "false"}
                            onChange={(e) => {
                              const updatedUsers = [...users];
                              updatedUsers[index].sandboxMode = toggleSwitch;

                              e.target.value === "true"
                                ? setToggleSwitch(true)
                                : setToggleSwitch(false);

                              updateMemberSandbox(updatedUsers[index]);
                              setUsers(updatedUsers);
                            }}
                          >
                            <option value={"true"}>Enabled</option>
                            <option value={"false"}>Disabled</option>
                          </Select>
                        )}
                      </Td>
                      <Td>
                        <Flex justify="center">
                          <DeleteIcon
                            style={{
                              cursor: "pointer",
                              fontSize: "1.2rem",
                              marginBottom: "0.3rem",
                            }}
                            onClick={() => {
                              const updatedUsers = [...users];
                              updatedUsers.splice(index, 1);

                              handleDeleteMember(user);
                              setUsers(updatedUsers);
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
