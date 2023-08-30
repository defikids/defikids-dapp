import { User } from "@/dataSchema/types";
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
import { TransactionStepper, steps } from "../steppers/TransactionStepper";
import { StepperContext } from "@/dataSchema/enums";
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

      setActiveStep(1);

      const avatar = `https://ipfs.io/ipfs/${ifpsHash}`;
      console.log(avatar);

      const body = {
        ...familyDetails,
        avatarURI: avatar,
      };

      const payload = {
        key: userDetails?.wallet,
        value: body,
      };

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
