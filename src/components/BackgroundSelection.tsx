"use client";

import { User } from "@/data-schema/types";
import { useAuthStore } from "@/store/auth/authStore";
import {
  Flex,
  useToast,
  Box,
  useSteps,
  Button,
  Text,
  Switch,
} from "@chakra-ui/react";
import axios from "axios";
import { useRef, useState } from "react";
import shallow from "zustand/shallow";
import { TransactionStepper, steps } from "./steppers/TransactionStepper";
import { StepperContext } from "@/data-schema/enums";
import { transactionErrors } from "@/utils/errorHanding";
import { BgOpacitySliderThumbWithTooltip } from "@/components/BgOpacitySliderThumbWithTooltip";
import { CardOpacitySliderThumbWithTooltip } from "@/components/CardOpacitySliderThumbWithTooltip";
import { OpacityContext } from "@/data-schema/enums";

export const BackgroundSelection = ({
  familyDetails,
  fetchFamilyDetails,
  onOpenBackgroundDefaults,
  setBackgroundOpacity,
  setCardOpacity,
}: {
  familyDetails: User;
  fetchFamilyDetails: () => void;
  onOpenBackgroundDefaults: () => void;
  setBackgroundOpacity: (opacity: number) => void;
  setCardOpacity: (opacity: number) => void;
}) => {
  //=============================================================================
  //                               STATE
  //=============================================================================

  const [loading, setIsLoading] = useState(false);
  const [opacityType, setOpacityType] = useState(OpacityContext.BACKGROUND);

  //=============================================================================
  //                               HOOKS
  //=============================================================================
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const toast = useToast();

  const { userDetails, setUserDetails, opacity } = useAuthStore(
    (state) => ({
      userDetails: state.userDetails,
      setUserDetails: state.setUserDetails,
      opacity: state.opacity,
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
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

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

      const body = {
        ...familyDetails,
        backgroundURI: background,
      };

      const payload = {
        key: userDetails?.wallet,
        value: body,
      };

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

  const handleOpacityChange = async () => {
    console.log("opacity", opacity);
    try {
      if (opacityType === OpacityContext.BACKGROUND) {
        const body = {
          ...familyDetails,
          opacity: {
            ...familyDetails.opacity,
            background: opacity,
          },
        };

        const payload = {
          key: userDetails?.wallet,
          value: body,
        };

        await axios.post(`/api/vercel/set-json`, payload);
        setUserDetails(body);
        fetchFamilyDetails();

        toast({
          title: "Background opacity successfully updated",
          status: "success",
        });
      } else {
        const body = {
          ...familyDetails,
          opacity: {
            ...familyDetails.opacity,
            card: opacity,
          },
        };

        const payload = {
          key: userDetails?.wallet,
          value: body,
        };

        await axios.post(`/api/vercel/set-json`, payload);
        setUserDetails(body);
        fetchFamilyDetails();

        toast({
          title: "Card opacity successfully updated",
          status: "success",
        });
      }
    } catch (e) {
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
      <Flex direction="column" justify="center" align="center">
        <Flex direction="row" justify="center" align="center" w="100%">
          <Button
            cursor="pointer"
            variant="outline"
            colorScheme="blue"
            size="md"
            style={{
              borderRadius: "10px",
            }}
            w="100%"
            mr={2}
            onClick={onOpenBackgroundDefaults}
          >
            Default
          </Button>

          <Button
            cursor="pointer"
            onClick={openFileInput}
            variant="outline"
            colorScheme="blue"
            size="md"
            style={{
              borderRadius: "10px",
            }}
            w="100%"
            ml={2}
          >
            Custom
          </Button>
        </Flex>

        <Flex w="100%" my={4}>
          {opacityType === OpacityContext.BACKGROUND
            ? "Background Opacity"
            : "Card Opacity"}
        </Flex>

        {opacityType === OpacityContext.CARD ? (
          <Flex w="100%">
            <CardOpacitySliderThumbWithTooltip
              setCardOpacity={setCardOpacity}
            />
          </Flex>
        ) : (
          <Flex w="100%">
            <BgOpacitySliderThumbWithTooltip
              setBackgroundOpacity={setBackgroundOpacity}
            />
          </Flex>
        )}

        <Flex justify="center" alignItems="center" w="100%" mt={10}>
          <Button
            cursor="pointer"
            variant="outline"
            colorScheme="blue"
            size="sm"
            onClick={handleOpacityChange}
          >
            Submit
          </Button>

          {/* <Flex direction="row" justify="center" align="center">
            <Text mr={2}>{OpacityContext.BACKGROUND}</Text>
            <Switch
              size="md"
              onChange={() => {
                opacityType === OpacityContext.BACKGROUND
                  ? setOpacityType(OpacityContext.CARD)
                  : setOpacityType(OpacityContext.BACKGROUND);
              }}
            />
            <Text ml={2}>{OpacityContext.CARD}</Text>
          </Flex> */}
        </Flex>
      </Flex>

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
