"use client";

import {
  FormControl,
  Input,
  Button,
  useSteps,
  useToast,
  Heading,
  Box,
  Tag,
  TagLabel,
  Flex,
  Select,
  TagCloseButton,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import {
  TransactionStepper,
  steps,
} from "@/components/steppers/TransactionStepper";
import { useContractStore } from "@/store/contract/contractStore";
import shallow from "zustand/shallow";
import { StepperContext } from "@/data-schema/enums";
import { transactionErrors } from "@/utils/errorHanding";
import { TransactionResponse } from "@ethersproject/abstract-provider";
import { ethers } from "ethers";
import { User } from "@/data-schema/types";
import { MdArrowDropDown } from "react-icons/md";
import { EtherIcon } from "@/components/logos/EtherIcon";
import { useBalance } from "wagmi";
import { useAuthStore } from "@/store/auth/authStore";

export const Airdrop = ({
  members,
  onClose,
}: {
  members: User[];
  onClose: () => void;
}) => {
  //=============================================================================
  //                               STATE
  //=============================================================================
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  //
  //=============================================================================
  //                               HOOKS
  //=============================================================================

  const toast = useToast();

  const { activeStep, setActiveStep } = useSteps({
    index: 1,
    count: steps.length,
  });

  const { defiDollarsContractInstance } = useContractStore(
    (state) => ({
      defiDollarsContractInstance: state.defiDollarsContractInstance,
    }),
    shallow
  );

  const { userDetails } = useAuthStore(
    (state) => ({
      userDetails: state.userDetails,
    }),
    shallow
  );

  const { data } = useBalance({
    address: userDetails?.wallet as `0x${string}`,
    watch: true,
  });

  //=============================================================================
  //                               FUNCTIONS
  //=============================================================================

  const handleAirdrop = async () => {
    if (selectedUsers.length === 0) {
      toast({
        title: "Please select at least one user",
        status: "error",
      });
      return;
    }

    if (!amount) {
      toast({
        title: "Please enter an amount",
        status: "error",
      });
      return;
    }

    try {
      setIsLoading(true);

      setActiveStep(0);

      const recipients = selectedUsers.map((user) => user.wallet);

      const formattedAmount = ethers.utils.parseEther(amount);

      const formattedValue = ethers.utils.parseEther(
        String(Number(amount) * recipients.length)
      );

      const tx = (await defiDollarsContractInstance?.airdrop(
        recipients,
        formattedAmount,
        {
          value: formattedValue,
        }
      )) as TransactionResponse;

      setActiveStep(1);
      await tx.wait();

      toast({
        title: "Allowance Sent Successful",
        status: "success",
      });
      onClose();
      setIsLoading(false);
      setAmount("");
      setSelectedUsers([]);
    } catch (e) {
      const errorDetails = transactionErrors(e);
      toast(errorDetails);
      setIsLoading(false);
      setAmount("");
      setSelectedUsers([]);
    }
  };

  const airdropComponent = () => {
    return (
      <Box>
        <Flex alignItems="center" justify="center">
          {EtherIcon(35, 35)}
          <Flex direction="row" alignItems="baseline" justify="center" my={5}>
            <Heading size="2xl" display="flex" alignItems="baseline">
              {`${Number(data?.formatted).toFixed(4)}`}
            </Heading>
            <Text fontSize="sm" ml={2}>
              ETH
            </Text>
          </Flex>
        </Flex>

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
                <TagLabel color="black" fontWeight="bold">
                  {user.username}
                </TagLabel>
                <TagCloseButton
                  color="black"
                  onClick={() => {
                    setSelectedUsers((prev) => prev.filter((u) => u !== user));
                  }}
                />
              </Flex>
            </Tag>
          ))}

        <FormControl>
          <Select
            placeholder="Select user"
            mt={5}
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

              setSelectedUsers((prev) => [...prev, selectedUser!]);
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
            placeholder="Amount per user"
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
    );
  };

  return (
    <Box>
      {isLoading ? (
        <TransactionStepper
          activeStep={activeStep}
          context={StepperContext.DEFAULT}
        />
      ) : (
        airdropComponent()
      )}

      {!isLoading && (
        <Flex justifyContent="flex-end" mt={5}>
          <Button colorScheme="blue" onClick={handleAirdrop}>
            Send Allowance
          </Button>
        </Flex>
      )}
    </Box>
  );
};
