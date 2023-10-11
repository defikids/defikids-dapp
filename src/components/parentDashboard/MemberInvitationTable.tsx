import { IInvitation } from "@/models/Invitation";
import { deleteInvitation } from "@/services/mongo/database";
import { formatDateToIsoString } from "@/utils/dateTime";
import { DeleteIcon } from "@chakra-ui/icons";
import {
  Flex,
  IconButton,
  useToast,
  Text,
  Box,
  Container,
} from "@chakra-ui/react";

const MemberInvitationTable = ({
  isMobileSize,
  invitations,
  setInvitations,
  setShowInvitations,
}: {
  isMobileSize: boolean;
  invitations: IInvitation[];
  setInvitations: (invitations: IInvitation[]) => void;
  setShowInvitations: (showInvitations: boolean) => void;
}) => {
  const toast = useToast();

  const removeInvitation = async (_id: string) => {
    try {
      const updatedInvitations = invitations.filter(
        (invitation) => invitation._id !== _id
      );
      setInvitations(updatedInvitations);

      toast({
        title: "Member Invite Removed",
        status: "success",
      });

      if (updatedInvitations.length === 0) {
        setShowInvitations(false);
      }

      await deleteInvitation(_id);
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "An error occured while removing the invite.",
        status: "error",
      });
    }
  };

  return (
    <Box>
      {invitations.map((invitation, index: number) => (
        <Container key={index}>
          <Flex
            justify="space-between"
            style={{
              border: "1px solid #e2e8f0",
              borderRadius: "0.5rem",
              padding: "1rem",
              marginBottom: "1rem",
            }}
          >
            <Flex justify="center" direction="column">
              <Text fontSize="xs" fontWeight="bold">
                Sent: {formatDateToIsoString(invitation.date)}
              </Text>
              <Text fontSize={isMobileSize ? "sm" : "md"}>
                {invitation.email}
              </Text>
            </Flex>
            <IconButton
              aria-label="Remove Invite"
              icon={<DeleteIcon />}
              variant="solid"
              color="black"
              size="md"
              padding={0}
              margin={0}
              onClick={() => removeInvitation(invitation._id)}
            />
          </Flex>
        </Container>
      ))}
    </Box>
  );
};

export default MemberInvitationTable;
