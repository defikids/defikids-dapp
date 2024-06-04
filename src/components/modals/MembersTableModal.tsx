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
import MemberAccordian from "@/components/dashboards/parentDashboard/MemberAccordian";
import { RegisterMemberForm } from "../forms/RegisterMemberForm";
import axios from "axios";
import { transactionErrors } from "@/utils/errorHanding";
import { User } from "@/data-schema/types";
import MemberInvitationTable from "@/components/dashboards/parentDashboard/MemberInvitationTable";
import { EmailVerificationRequired } from "@/components/email/EmailVerificationRequired";
import { getFamilyMembersByAccount } from "@/BFF/mongo/getFamilyMembersByAccount";
import { getAccount } from "@/services/mongo/routes/account";
import { createInvitation } from "@/services/mongo/routes/invitation";
import { convertTimestampToSeconds } from "@/utils/dateTime";
import jwt from "jsonwebtoken";
import { IInvitation } from "@/models/Invitation";
import { getInvitationsByAccount } from "@/BFF/mongo/getInvitationsByAccount";
import mongoose from "mongoose";
import { getSignerAddress } from "@/blockchain/utils";
import { getUserByWalletAddress } from "@/services/mongo/routes/user";

export const MembersTableModal = ({
  isOpen,
  onClose,
  user,
  setUser,
  reloadUserData,
}: {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  setUser: (user: User) => void;
  reloadUserData: () => void;
}) => {
  //=============================================================================
  //                               STATE
  //=============================================================================
  const [showRegisterMemberForm, setShowRegisterMemberForm] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");
  const [sandboxMode, setSandboxMode] = useState(false);
  const [showInvitations, setShowInvitations] = useState(false);
  const [invitations, setInvitations] = useState<IInvitation[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  // const [user, setUser] = useState({} as User);

  const { width } = useWindowSize();
  const isMobileSize = width < 900;

  //=============================================================================
  //                               HOOKS
  //=============================================================================
  const toast = useToast();

  useEffect(() => {
    const fetchMembers = async () => {
      const user = await getUserByWalletAddress(await getSignerAddress());
      setUser(user);
      console.log("user", user);

      const members = (await getFamilyMembersByAccount(
        user.accountId!
      )) as User[];
      console.log("members", members);
      setUsers(members);
    };

    const fetchInvitations = async () => {
      const invitations = await getInvitationsByAccount(user.accountId!);
      console.log("invitations", invitations);
      setInvitations(invitations);
    };

    fetchMembers();
    fetchInvitations();
  }, []);

  //=============================================================================
  //                               FUNCTIONS
  //=============================================================================
  const invitationExists = (
    accountId: mongoose.Schema.Types.ObjectId,
    email: string
  ) => {
    const invitation = invitations
      .filter((invitation) => invitation.accountId === accountId)
      .find((invitation) => invitation.email === email);

    if (invitation) {
      toast({
        title: "Error",
        description: "An invitation has already been sent to this email.",
        status: "error",
      });
      setHasSubmitted(false);
      setEmailAddress("");
      return true;
    }
    return false;
  };

  const userExists = (email: string, users: User[]) => {
    const user = users.find((user) => user.email === email);

    if (user) {
      toast({
        title: "Error",
        description: "This user is already a member of your family.",
        status: "error",
      });
      setHasSubmitted(false);
      setEmailAddress("");
      return true;
    }
    return false;
  };

  const handleSubmit = async () => {
    setHasSubmitted(true);

    try {
      const { wallet, accountId } = user;
      const email = emailAddress.trim();

      if (userExists(email, users)) return;
      if (invitationExists(accountId!, email)) return;

      const emailSent = await sendEmailInvite(email, wallet, accountId!);

      if (!emailSent) {
        toast({
          title: "Error",
          description: "An error occured while sending the invite.",
          status: "error",
        });
        return;
      }
      setShowRegisterMemberForm(false);
      setHasSubmitted(false);
      setEmailAddress("");
    } catch (e) {
      console.log(e);
      setShowRegisterMemberForm(false);
    }
  };

  const storeInvitation = async (email: string, token: any) => {
    try {
      const invitationPayload = {
        accountId: user.accountId,
        date: convertTimestampToSeconds(Date.now()),
        email,
        token,
      };

      const newInvite = await createInvitation(invitationPayload);
      setInvitations((prevInvitations) => [...prevInvitations, newInvite]);
    } catch (err) {
      console.error(err);
    }
  };

  const sendEmailInvite = async (
    email: string,
    wallet: string,
    accountId: mongoose.Schema.Types.ObjectId
  ) => {
    const { familyName } = await getAccount(accountId!);

    try {
      const body = {
        accountId,
        email,
        parentAddress: wallet.trim(),
        familyName,
        sandboxMode,
      };

      const token = jwt.sign(
        {
          ...body,
        },
        process.env.NEXT_PUBLIC_JWT_SECRET || "",
        {
          expiresIn: "7d",
          jwtid: Date.now().toString(),
        }
      );

      const payload = {
        token,
        email,
        familyName,
      };

      await axios.post(`/api/emails/invite-member`, payload);

      await storeInvitation(email, token);

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
    if (showRegisterMemberForm && !showInvitations) {
      return "Invite Member";
    } else if (showInvitations) {
      return "Member Invites";
    } else {
      return "Members";
    }
  }, [showRegisterMemberForm, showInvitations]);

  return (
    <Box margin="20px">
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="xl"
        onCloseComplete={() => {
          setShowRegisterMemberForm(false);
          setHasSubmitted(false);
          setEmailAddress("");
          setSandboxMode(false);
          setShowInvitations(false);
          reloadUserData();
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
            {user.emailVerified && (
              <>
                {showRegisterMemberForm && (
                  <RegisterMemberForm
                    setShowRegisterMemberForm={setShowRegisterMemberForm}
                    hasSubmitted={hasSubmitted}
                    handleSubmit={handleSubmit}
                    emailAddress={emailAddress}
                    setEmailAddress={setEmailAddress}
                    sandboxMode={sandboxMode}
                    setSandboxMode={setSandboxMode}
                  />
                )}

                {showInvitations && (
                  <MemberInvitationTable
                    isMobileSize={isMobileSize}
                    invitations={invitations}
                    setInvitations={setInvitations}
                    setShowInvitations={setShowInvitations}
                  />
                )}

                {!showRegisterMemberForm &&
                  !showInvitations &&
                  users &&
                  users.length > 0 && (
                    <MemberAccordian
                      parent={user}
                      users={users}
                      setUsers={setUsers}
                    />
                  )}

                {!showRegisterMemberForm &&
                  !showInvitations &&
                  users.length === 0 && (
                    <Heading size="sm" textAlign="center" mt={4}>
                      You have no members in your family yet.
                    </Heading>
                  )}
              </>
            )}

            {!user.emailVerified && users.length === 0 && (
              <EmailVerificationRequired user={user} isUpdated />
            )}
          </ModalBody>
          <ModalFooter>
            {user?.emailVerified && (
              <Container>
                <Flex direction="row" justify="flex-end" w="100%">
                  {!showRegisterMemberForm && (
                    <Button
                      size="xs"
                      colorScheme="blue"
                      onClick={() => {
                        setShowRegisterMemberForm(true);
                        setShowInvitations(false);
                        setEmailAddress("");
                      }}
                    >
                      Invite
                    </Button>
                  )}

                  {/* @ts-ignore */}
                  {invitations?.length > 0 && (
                    <Button
                      size="xs"
                      ml={2}
                      colorScheme="blue"
                      onClick={() => {
                        if (showInvitations) {
                          setShowInvitations(false);
                          setShowRegisterMemberForm(false);
                        } else {
                          setShowInvitations(true);
                          setShowRegisterMemberForm(false);
                        }
                      }}
                    >
                      {!showInvitations ? "Invitations" : "Members"}
                    </Button>
                  )}

                  {showRegisterMemberForm && !showInvitations && (
                    <Button
                      size="xs"
                      ml={2}
                      colorScheme="blue"
                      onClick={() => {
                        setShowRegisterMemberForm(false);
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
