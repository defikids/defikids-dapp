"use client";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  Input,
  ModalFooter,
  Button,
  useSteps,
  useToast,
  Heading,
  Box,
  Tag,
  Avatar,
  TagLabel,
  Flex,
  Select,
  TagCloseButton,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  TransactionStepper,
  steps,
} from "@/components/steppers/TransactionStepper";
import { useContractStore } from "@/store/contract/contractStore";
import shallow from "zustand/shallow";
import { useAuthStore } from "@/store/auth/authStore";
import { StepperContext } from "@/data-schema/enums";
import { transactionErrors } from "@/utils/errorHanding";
import { TransactionResponse } from "@ethersproject/abstract-provider";
import { ethers } from "ethers";
import axios from "axios";
import { User } from "@/data-schema/types";
import { MdArrowDropDown } from "react-icons/md";
import { getFamilyMembers } from "@/BFF/mongo/getFamilyMembers";

export const AirdropModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  //=============================================================================
  //                               STATE
  //=============================================================================
  const [members, setMembers] = useState<User[]>([]);
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  //
  //=============================================================================
  //                               HOOKS
  //=============================================================================
  const { userDetails } = useAuthStore(
    (state) => ({
      userDetails: state.userDetails,
    }),
    shallow
  );

  useEffect(() => {
    if (!userDetails?.wallet) return;

    const fetchMembers = async () => {
      const members = (await getFamilyMembers(
        userDetails.accountId!
      )) as User[];
      setMembers(members);
    };

    fetchMembers();
  }, []);

  const { connectedSigner } = useContractStore(
    (state) => ({
      connectedSigner: state.connectedSigner,
    }),
    shallow
  );

  const toast = useToast();

  const { activeStep, setActiveStep } = useSteps({
    index: 1,
    count: steps.length,
  });

  //=============================================================================
  //                               FUNCTIONS
  //=============================================================================

  const onSubmit = async () => {
    const recipientAddresses = selectedUsers.map((user) => user.wallet);
    const amountToSend = ethers.utils.parseEther(amount);
    setIsLoading(true);
    try {
      // setActiveStep(0);
      // const tx = (await connectedSigner?.sendTransaction({
      //   to: recipientAddress,
      //   value: amountToSend,
      // })) as TransactionResponse;
      // setActiveStep(1);
      // await tx.wait();
      // toast({
      //   title: "Funds sent successfully",
      //   status: "success",
      // });
      // onClose();
    } catch (e) {
      const errorDetails = transactionErrors(e);
      toast(errorDetails);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      onCloseComplete={() => {
        setIsLoading(false);
        setMembers([]);
        setAmount("");
      }}
      isCentered
    >
      <ModalOverlay
        bg="none"
        backdropFilter="auto"
        backdropInvert="10%"
        backdropBlur="4px"
      />
      <ModalContent>
        <ModalHeader>
          <Heading fontSize="sm">Airdrop Funds</Heading>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {isLoading ? (
            <TransactionStepper
              activeStep={activeStep}
              context={StepperContext.DEFAULT}
            />
          ) : (
            <Box>
              {selectedUsers &&
                selectedUsers?.length > 0 &&
                selectedUsers?.map((user, index) => (
                  <Tag
                    size="lg"
                    colorScheme="purple"
                    borderRadius="full"
                    variant="solid"
                    key={index}
                    mr={2}
                  >
                    <Flex align="center" p={1}>
                      <Avatar
                        src={user.avatarURI}
                        size="sm"
                        name={user.username}
                        mr={2}
                        ml={-3}
                      />
                      <TagLabel color="black" fontWeight="bold">
                        {user.username}
                      </TagLabel>
                      <TagCloseButton
                        color="black"
                        onClick={() => {
                          setSelectedUsers((prev) =>
                            prev.filter((u) => u !== user)
                          );
                        }}
                      />
                    </Flex>
                  </Tag>
                ))}

              <FormControl>
                <Heading size="md" color="white" pb={3}>
                  Users
                </Heading>
                <Select
                  placeholder="Select user"
                  mb={2}
                  style={{
                    border: "1px solid lightgray",
                  }}
                  icon={<MdArrowDropDown />}
                  onChange={(e) => {
                    const selectedUsername = e.target.value;
                    if (selectedUsername === "") return;

                    const selectedUser = members.find(
                      (member) => member.username === selectedUsername
                    );

                    //@ts-ignore
                    if (selectedUsers.includes(selectedUser)) {
                      e.target.value = "";
                      return;
                    }

                    // setSelectedUsers((prev) => [...prev, selectedUser]);
                    e.target.value = "";
                  }}
                >
                  {members.map((member) => (
                    <option key={member.username}>{member.username}</option>
                  ))}
                </Select>
              </FormControl>

              <FormControl>
                <Input
                  placeholder="Amount to send to each member"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  style={{
                    border: "1px solid lightgray",
                  }}
                  sx={{
                    "::placeholder": {
                      color: "gray.400",
                    },
                  }}
                />
              </FormControl>
            </Box>
          )}
        </ModalBody>
        <ModalFooter>
          {!isLoading && (
            <Button colorScheme="blue" onClick={onSubmit}>
              Send
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
