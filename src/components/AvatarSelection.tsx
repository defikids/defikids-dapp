"use client";

import {
  Flex,
  useToast,
  Avatar,
  Box,
  useSteps,
  Button,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { TransactionStepper, steps } from "./steppers/TransactionStepper";
import { StepperContext } from "@/data-schema/enums";
import { transactionErrors } from "@/utils/errorHanding";
import { editUser, getUserByWalletAddress } from "@/services/mongo/routes/user";
import { getSignerAddress } from "@/blockchain/utils";
import { User } from "@/data-schema/types";

export const AvatarSelection = ({
  user,
  setUser,
}: {
  user: User;
  setUser: (user: User) => void;
}) => {
  //=============================================================================
  //                               HOOKS
  //=============================================================================
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const openFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const toast = useToast();

  const { activeStep, setActiveStep } = useSteps({
    index: 1,
    count: steps(StepperContext.AVATAR).length,
  });

  //=============================================================================
  //                               STATE
  //=============================================================================

  const [selectedFile, setSelectedFile] = useState() as any;
  const [avatar, setAvatar] = useState(user?.avatarURI);
  const [loading, setIsLoading] = useState(false);

  //=============================================================================
  //                               FUNCTIONS
  //=============================================================================

  const uploadToIpfs = async (selectedFile: File | null) => {
    try {
      const response = await axios.post(
        `/api/ipfs/upload-to-ipfs`,
        selectedFile,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (e) {
      console.error(e as Error);
      return {
        validationError: "",
        ifpsHash: "",
      };
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setActiveStep(0);

    try {
      const { validationError, ifpsHash } = (await uploadToIpfs(
        selectedFile
      )) as {
        validationError: string;
        ifpsHash: string;
      };

      if (validationError) {
        toast({
          title: "Error",
          description: validationError,
          status: "error",
        });
        return;
      }

      setActiveStep(1);

      const avatar = `https://ipfs.io/ipfs/${ifpsHash}`;
      console.log(avatar);

      console.log("user", user);
      const payload = {
        ...user,
        avatarURI: avatar,
      };

      console.log("payload", payload);

      await editUser(user?.accountId!, payload);
      setUser(payload);

      toast({
        title: "Avatar successfully updated",
        status: "success",
      });

      setIsLoading(false);
      setSelectedFile(null);
    } catch (e) {
      setIsLoading(false);
      const errorDetails = transactionErrors(e);
      toast(errorDetails);
    }
  };

  if (loading) {
    return (
      <Flex direction="row" justify="center" align="center" mt="3rem">
        <TransactionStepper
          activeStep={activeStep}
          context={StepperContext.AVATAR}
        />
      </Flex>
    );
  }
  return (
    <>
      <Flex
        direction="column"
        justify="center"
        align="center"
        borderRadius={10}
      >
        <Avatar
          size="2xl"
          name={user?.username ? user?.username : "Avatar"}
          src={avatar ? avatar : "/images/placeholder-avatar.jpeg"}
          _hover={{ cursor: "pointer", transform: "scale(1.1)" }}
          onClick={openFileInput}
        />
        {selectedFile && (
          <Button
            variant="solid"
            size={"sm"}
            onClick={handleSubmit}
            mt={4}
            colorScheme="blue"
          >
            Submit
          </Button>
        )}
      </Flex>

      <Box>
        {/* Avatar Action */}
        {/* hidden file input */}
        <input
          type="file"
          style={{ display: "none" }}
          ref={fileInputRef}
          onChange={(e) => {
            e.preventDefault();
            const files = e.target.files;
            if (!files) return;

            const validTypes = ["image/png", "image/jpg", "image/jpeg"];

            if (
              files &&
              files.length > 0 &&
              !validTypes.includes(files[0].type)
            ) {
              toast({
                title: "Error",
                description:
                  "Invalid file type. Only accept images with .png, .jpg or .jpeg extensions.",
                status: "error",
              });
            }

            if (files && files.length > 0) {
              const file = files[0];
              const reader = new FileReader();

              reader.onloadend = () => {
                setAvatar(reader.result as string);
              };

              reader.readAsDataURL(file);

              const formData = new FormData();
              formData.append("file", file);
              formData.append("description", "child_avatar");
              setSelectedFile(formData);
            } else {
              console.log("User canceled file selection");
            }
          }}
        />
      </Box>
    </>
  );
};
