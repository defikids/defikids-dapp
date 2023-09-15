import { User } from "@/data-schema/types";
import { useAuthStore } from "@/store/auth/authStore";
import {
  Flex,
  useToast,
  Avatar,
  Box,
  useSteps,
  Button,
} from "@chakra-ui/react";
import axios from "axios";
import { useRef, useState } from "react";
import shallow from "zustand/shallow";
import { TransactionStepper, steps } from "./steppers/TransactionStepper";
import { StepperContext } from "@/data-schema/enums";
import { transactionErrors } from "@/utils/errorHanding";

export const AvatarSelection = ({
  familyDetails,
  fetchFamilyDetails,
}: {
  familyDetails: User;
  fetchFamilyDetails: () => void;
}) => {
  //=============================================================================
  //                               STATE
  //=============================================================================

  const [selectedFile, setSelectedFile] = useState(null);
  const [avatar, setAvatar] = useState(familyDetails?.avatarURI);
  const [loading, setIsLoading] = useState(false);

  //=============================================================================
  //                               HOOKS
  //=============================================================================
  const fileInputRef = useRef(null);

  console.log("familyDetails - on load", familyDetails);

  const openFileInput = () => {
    fileInputRef.current.click();
  };

  const toast = useToast();

  const { userDetails, setUserDetails } = useAuthStore(
    (state) => ({
      userDetails: state.userDetails,
      setUserDetails: state.setUserDetails,
    }),
    shallow
  );

  const { activeStep, setActiveStep } = useSteps({
    index: 1,
    count: steps(StepperContext.AVATAR).length,
  });

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

  const unpinFromIpfs = async (ipfsHash: string) => {
    try {
      // send as query param
      const result = await axios.get(
        `/api/ipfs/unpin-from-ipfs?ipfsHash=${ipfsHash}`
      );
      console.log(result.data);
      return result.data.success;
    } catch (e) {
      console.error(e as Error);
    }
  };

  const handleSubmit = async () => {
    console.log("selectedFile", selectedFile);
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

      const avatar = `https://ipfs.io/ipfs/${ifpsHash}`;
      console.log(avatar);

      // delete old avatar from ipfs
      console.log("familyDetails?.avatarURI", familyDetails?.avatarURI);
      console.log("avatar", avatar);
      console.log(
        "familyDetails?.avatarURI.includes(ipfs)",
        familyDetails?.avatarURI.includes("ipfs")
      );
      console.log(
        "familyDetails?.avatarURI !== avatar",
        familyDetails?.avatarURI !== avatar
      );
      if (
        familyDetails?.avatarURI &&
        familyDetails?.avatarURI.includes("ipfs") &&
        familyDetails?.avatarURI !== avatar
      ) {
        const oldIpfsHash = familyDetails?.avatarURI.split("/")[4];
        const result = await unpinFromIpfs(oldIpfsHash);
        if (result.success === false) {
          toast({
            title: "Error",
            description: "Failed to delete old avatar from IPFS",
            status: "error",
          });
          setIsLoading(false);
          return;
        }
      }

      setActiveStep(1);

      const body = {
        ...familyDetails,
        avatarURI: avatar,
      };

      const payload = {
        key: userDetails?.wallet,
        value: body,
      };

      console.log("payload", payload);

      await axios.post(`/api/vercel/set-json`, payload);
      setUserDetails(body);
      fetchFamilyDetails();

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
          name={familyDetails?.username ? familyDetails?.username : "Avatar"}
          src={avatar ? avatar : "/images/placeholder-avatar.jpeg"}
          _hover={{ cursor: "pointer", transform: "scale(1.1)" }}
          onClick={openFileInput}
        />
        {selectedFile && (
          <Button size={"xs"} onClick={handleSubmit} mt={4}>
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
