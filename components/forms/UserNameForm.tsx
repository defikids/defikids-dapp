import { User } from "@/dataSchema/types";
import { useAuthStore } from "@/store/auth/authStore";
import {
  Flex,
  useToast,
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import shallow from "zustand/shallow";
import { transactionErrors } from "@/utils/errorHanding";

export const EditUsername = ({
  familyDetails,
  fetchFamilyDetails,
}: {
  familyDetails: User;
  fetchFamilyDetails: () => void;
}) => {
  //=============================================================================
  //                               STATE
  //=============================================================================
  const [username, setUsername] = useState("");

  //=============================================================================
  //                               HOOKS
  //=============================================================================

  const { userDetails, setUserDetails } = useAuthStore(
    (state) => ({
      userDetails: state.userDetails,
      setUserDetails: state.setUserDetails,
    }),
    shallow
  );

  const toast = useToast();

  //=============================================================================
  //                               FUNCTIONS
  //=============================================================================

  const handleSubmit = async () => {
    try {
      if (!username) {
        toast({
          title: "Error",
          description: "Username cannot be empty",
          status: "error",
        });
        return;
      }

      const body = {
        ...familyDetails,
        username,
      };

      const payload = {
        key: userDetails?.wallet,
        value: body,
      };

      await axios.post(`/api/vercel/set-json`, payload);
      setUserDetails(body);
      fetchFamilyDetails();
      setUsername("");

      toast({
        title: "Username successfully updated",
        status: "success",
      });
    } catch (e) {
      const errorDetails = transactionErrors(e);
      toast(errorDetails);
    }
  };

  return (
    <>
      <Flex
        direction="column"
        justify="center"
        align="center"
        borderRadius={10}
      >
        <FormControl>
          <FormLabel>New Username</FormLabel>
          <Input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              border: "1px solid lightgray",
            }}
          />
        </FormControl>
        <Button size={"xs"} onClick={handleSubmit} mt={4}>
          Submit
        </Button>
      </Flex>
    </>
  );
};
