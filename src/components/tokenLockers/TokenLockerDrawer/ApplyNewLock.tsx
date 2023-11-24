import {
  Heading,
  VStack,
  Text,
  Box,
  FormControl,
  Button,
  Select,
} from "@chakra-ui/react";
import { useState } from "react";
import { MdArrowDropDown } from "react-icons/md";

export const ApplyNewLock = () => {
  const [lockTime, setLockTime] = useState("");

  const DAY_IN_SECONDS = 86400;

  const locktimes = [
    {
      value: 7 * DAY_IN_SECONDS,
      label: "7 days",
    },
    {
      value: 14 * DAY_IN_SECONDS,
      label: "14 days",
    },
    {
      value: 30 * DAY_IN_SECONDS,
      label: "30 days",
    },
    {
      value: 60 * DAY_IN_SECONDS,
      label: "60 days",
    },
    {
      value: 90 * DAY_IN_SECONDS,
      label: "90 days",
    },
  ];

  return (
    <Box>
      <VStack spacing={4} align="stretch">
        <Heading fontSize={"xl"} mb={1}>
          Adding to Locker
        </Heading>
        <Text fontSize={"md"} mb={1}>
          By creating a locker, you will be able to lock your tokens for a
          period of time.
        </Text>

        <Text fontSize={"md"} mb={1}>
          You will by require to permit the Defikids core contract to transfer
          your token on your behalf.
        </Text>
        <FormControl>
          <Select
            placeholder="Select lock time"
            style={{
              border: "1px solid lightgray",
            }}
            icon={<MdArrowDropDown />}
            onChange={(e) => {
              const selectedLockTime = e.target.value;
              setLockTime(selectedLockTime);
            }}
          >
            {locktimes.map((locktime) => (
              <option key={locktime.value} value={locktime.value}>
                {locktime.label}
              </option>
            ))}
          </Select>
        </FormControl>
      </VStack>
      <Button mt={4} colorScheme="blue" onClick={() => {}}>
        Continue
      </Button>
    </Box>
  );
};
