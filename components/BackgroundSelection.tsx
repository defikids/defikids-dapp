import { User } from "@/dataSchema/types";
import { useAuthStore } from "@/store/auth/authStore";
import {
  Flex,
  useToast,
  Avatar,
  Box,
  useSteps,
  Button,
  Grid,
  GridItem,
  Center,
} from "@chakra-ui/react";
import axios from "axios";
import { useCallback, useRef, useState } from "react";
import shallow from "zustand/shallow";
import { TransactionStepper, steps } from "./steppers/TransactionStepper";
import { StepperContext } from "@/dataSchema/enums";
import { transactionErrors } from "@/utils/errorHanding";
import { GrAddCircle } from "react-icons/gr";

export const BackgroundSelection = ({
  familyDetails,
  fetchFamilyDetails,
  onOpenBackgroundDefaults,
}: {
  familyDetails: User;
  fetchFamilyDetails: () => void;
  onOpenBackgroundDefaults: () => void;
}) => {
  //=============================================================================
  //                               STATE
  //=============================================================================

  const [loading, setIsLoading] = useState(false);
  // const [selectedFile, setSelectedFile] = useState(null);
  // const [background, setBackground] = useState(familyDetails?.backgroundURI);

  //=============================================================================
  //                               HOOKS
  //=============================================================================
  const fileInputRef = useRef(null);

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
    count: steps(StepperContext.BACKGROUND).length,
  });

  //=============================================================================
  //                               FUNCTIONS
  //=============================================================================

  const openFileInput = () => {
    fileInputRef.current.click();
  };

  const uploadToIpfs = async (selectedFile: File | null) => {
    console.log("selectedFile", selectedFile);
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

  const handleSubmit = async (selectedFile: File) => {
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("description", "background");

    setIsLoading(true);
    setActiveStep(0);

    try {
      const { validationError, ifpsHash } = (await uploadToIpfs(
        formData as any
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

      const background = `https://ipfs.io/ipfs/${ifpsHash}`;
      console.log(background);

      const body = {
        ...familyDetails,
        backgroundURI: background,
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
        title: "Background successfully updated",
        status: "success",
      });

      setIsLoading(false);
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
          context={StepperContext.BACKGROUND}
        />
      </Flex>
    );
  }
  return (
    <>
      <Grid templateColumns="repeat(2, 1fr)" gap={6} h="100%">
        <GridItem
          w="100%"
          h="100%"
          bgImage="/images/backgrounds/city-center.png"
          bgSize="contain"
          cursor="pointer"
          style={{
            borderRadius: "10px",
          }}
          _hover={{
            transform: "scale(1.05)",
          }}
          onClick={onOpenBackgroundDefaults}
        />
        <Flex
          justify="center"
          alignItems="center"
          w="100%"
          h="100%"
          style={{
            border: "1px solid lightgray",
            borderRadius: "10px",
          }}
          _hover={{
            transform: "scale(1.05)",
          }}
          onClick={openFileInput}
          cursor="pointer"
        >
          <GrAddCircle size={100} />
        </Flex>
      </Grid>
      {/* <Grid templateColumns="repeat(2, 2fr)" gap={6}>
        <GridItem
          w="100%"
          h="20"
          bgImage="/images/backgrounds/city-center.png"
          bgSize="contain"
          cursor="pointer"
          onClick={() => {
            fetch("/images/backgrounds/city-center.png")
              .then((res) => res.blob())
              .then((blob) => {
                const file = new File([blob], "city-center.png", {
                  type: "image/png",
                });
                handleSubmit(file);
              });
          }}
        />
        <GridItem w="100%" h="20" bgImage="/images/backgrounds/Flashbots.png" />
        <GridItem w="100%" h="20" bg="blue.500" />
        <GridItem w="100%" h="20" bg="blue.500" />
      </Grid> */}
      {/* <Flex
        direction="column"
        justify="center"
        align="center"
        borderRadius={10}
      >
        <
          size="2xl"
          name={familyDetails?.username ? familyDetails?.username : "Avatar"}
          src={background ? background : "/images/placeholder-avatar.jpeg"}
          _hover={{ cursor: "pointer", transform: "scale(1.1)" }}
          onClick={openFileInput}
        />
        {selectedFile && (
          <Button size={"xs"} onClick={handleSubmit} mt={4}>
            Submit
          </Button>
        )}
      </Flex> */}

      <Box>
        {/* Avatar Action */}
        {/* hidden file input */}
        <input
          type="file"
          style={{ display: "none" }}
          ref={fileInputRef}
          onChange={(e) => {
            console.log("e", e);
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
              console.log("Hidden", file);
              const reader = new FileReader();

              // reader.onloadend = () => {
              //   setBackground(reader.result as string);
              // };

              reader.readAsDataURL(file);

              const formData = new FormData();
              formData.append("file", file);
              formData.append("description", "background");

              handleSubmit(file);
            } else {
              console.log("User canceled file selection");
            }
          }}
        />
      </Box>
    </>
  );
};

{
  /* <Box>
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
</Box> */
}
