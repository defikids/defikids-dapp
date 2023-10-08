import React, { useEffect, useMemo, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Heading,
  useToast,
  Box,
  ModalFooter,
  Button,
  Flex,
  Container,
} from "@chakra-ui/react";
import { useWindowSize } from "usehooks-ts";
import MemberAccordian from "@/components/parentDashboard/MemberAccordian";
import { RegisterMemberForm } from "../forms/RegisterMemberForm";
import { useAuthStore } from "@/store/auth/authStore";
import shallow from "zustand/shallow";
import axios from "axios";
import { transactionErrors } from "@/utils/errorHanding";
import { User } from "@/data-schema/types";
import MemberInvitationTable from "@/components/parentDashboard/MemberInvitationTable";
import { EmailVerificationRequired } from "@/components/email/EmailVerificationRequired";
import { ethers } from "ethers";

export const MembersTableModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  //=============================================================================
  //                               STATE
  //=============================================================================
  const [isLoading, setIsLoading] = useState(false);
  const [showRegisterChildForm, setShowRegisterChildForm] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");
  const [sandboxMode, setSandboxMode] = useState(false);
  const [showInvitations, setShowInvitations] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  const { width } = useWindowSize();
  const isMobileSize = width < 900;

  //=============================================================================
  //                               HOOKS
  //=============================================================================
  const toast = useToast();

  const { userDetails, setUserDetails } = useAuthStore(
    (state) => ({
      userDetails: state.userDetails,
      setUserDetails: state.setUserDetails,
    }),
    shallow
  );

  useEffect(() => {
    const fetchMembers = async () => {
      const members = [] as User[];
      //@ts-ignore
      for (const memberAddress of userDetails.children) {
        try {
          const response = await axios.get(
            `/api/vercel/get-json?key=${memberAddress}`
          );
          const user = response.data;

          if (ethers.utils.isAddress(user.wallet)) {
            members.push(user);
          }
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      }
      setUsers(members);
    };

    fetchMembers();
  }, []);

  //=============================================================================
  //                               FUNCTIONS
  //=============================================================================
  const handleSubmit = async () => {
    setHasSubmitted(true);

    try {
      const emailSent = await sendEmailInvite();

      if (!emailSent) {
        toast({
          title: "Error",
          description: "An error occured while sending the invite.",
          status: "error",
        });
        return;
      }
      setShowRegisterChildForm(false);
    } catch (e) {
      console.log(e);
      setShowRegisterChildForm(false);
    }
  };

  const storeInvitation = async (email: string) => {
    try {
      let response = await axios.get(
        `/api/vercel/get-json?key=${userDetails.wallet}`
      );

      const user = response.data as User;

      let emailExists = false;

      if (user.invitations)
        emailExists = user.invitations?.some(
          (obj: { email: string; dateSent: string }) => obj.email === email
        );

      console.log("emailExists", emailExists);
      const newInvitation = {
        email,
        dateSent: new Date(),
      };
      console.log("newInvitation", newInvitation);

      if (user.invitations && !emailExists) {
        const body = {
          ...user,
          invitations: [...user.invitations, newInvitation],
        };

        const payload = {
          key: user.wallet,
          value: body,
        };

        await axios.post(`/api/vercel/set-json`, payload);

        //@ts-ignore
        setUserDetails(body);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const sendEmailInvite = async () => {
    const { wallet, familyName, familyId } = userDetails;
    try {
      const payload = {
        email: emailAddress,
        parentAddress: wallet.trim(),
        familyName: familyName,
        sandboxMode,
        familyId,
      };

      await axios.post(`/api/emails/invite-member`, payload);
      await storeInvitation(emailAddress);

      toast({
        title: "Member Invite Email Sent",
        status: "success",
      });

      return true;
    } catch (e) {
      const errorDetails = transactionErrors(e);
      toast(errorDetails);
    }
  };

  const handleModalHeading = useMemo(() => {
    if (showRegisterChildForm && !showInvitations) {
      return "Invite Member";
    } else if (showInvitations) {
      return "Member Invites";
    } else {
      return "Members";
    }
  }, [showRegisterChildForm, showInvitations]);

  return (
    <Box margin="20px">
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="xl"
        onCloseComplete={() => {
          setIsLoading(false);
          setShowRegisterChildForm(false);
          setHasSubmitted(false);
          setEmailAddress("");
          setSandboxMode(false);
          setShowInvitations(false);
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
            <Heading fontSize="sm">{handleModalHeading}</Heading>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {userDetails.emailVerified ? (
              <>
                {showRegisterChildForm && (
                  <RegisterMemberForm
                    setShowRegisterChildForm={setShowRegisterChildForm}
                    hasSubmitted={hasSubmitted}
                    handleSubmit={handleSubmit}
                    emailAddress={emailAddress}
                    setEmailAddress={setEmailAddress}
                    sandboxMode={sandboxMode}
                    setSandboxMode={setSandboxMode}
                  />
                )}

                {showInvitations && (
                  <MemberInvitationTable isMobileSize={isMobileSize} />
                )}

                {!showRegisterChildForm &&
                  !showInvitations &&
                  userDetails.children &&
                  userDetails.children.length > 0 && (
                    <MemberAccordian users={users} setUsers={setUsers} />
                  )}

                {!showRegisterChildForm &&
                  !showInvitations &&
                  userDetails.children &&
                  userDetails.children.length === 0 && (
                    <Heading size="sm" textAlign="center" mt={4}>
                      You have no members in your family yet.
                    </Heading>
                  )}
              </>
            ) : (
              <EmailVerificationRequired userDetails={userDetails} />
            )}
          </ModalBody>
          <ModalFooter>
            {userDetails?.emailVerified && (
              <Container>
                <Flex direction="row" justify="flex-end" w="100%">
                  {!showRegisterChildForm && (
                    <Button
                      size="xs"
                      colorScheme="blue"
                      onClick={() => {
                        setShowRegisterChildForm(true);
                        setShowInvitations(false);
                        setEmailAddress("");
                      }}
                    >
                      Invite
                    </Button>
                  )}

                  {/* @ts-ignore */}
                  {userDetails?.invitations?.length > 0 && (
                    <Button
                      size="xs"
                      ml={2}
                      colorScheme="blue"
                      onClick={() => {
                        if (showInvitations) {
                          setShowInvitations(false);
                          setShowRegisterChildForm(false);
                        } else {
                          setShowInvitations(true);
                          setShowRegisterChildForm(false);
                        }
                      }}
                    >
                      {!showInvitations ? "Invitations" : "Members"}
                    </Button>
                  )}

                  {showRegisterChildForm && !showInvitations && (
                    <Button
                      size="xs"
                      ml={2}
                      colorScheme="blue"
                      onClick={() => {
                        setShowRegisterChildForm(false);
                        setShowInvitations(false);
                      }}
                    >
                      Members
                    </Button>
                  )}
                </Flex>
              </Container>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};
