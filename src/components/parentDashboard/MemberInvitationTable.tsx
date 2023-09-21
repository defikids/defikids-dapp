import { User } from "@/data-schema/types";
import { useAuthStore } from "@/store/auth/authStore";
import { formatDateToIsoString } from "@/utils/dateTime";
import { DeleteIcon, HamburgerIcon } from "@chakra-ui/icons";
import {
  Flex,
  Menu,
  MenuButton,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  IconButton,
  MenuList,
  MenuItem,
  useToast,
  Text,
  Box,
  Container,
} from "@chakra-ui/react";
import axios from "axios";
import { useCallback } from "react";
import { BsCalendarMonth } from "react-icons/bs";
import shallow from "zustand/shallow";

const MemberInvitationTable = ({ isMobileSize }: { isMobileSize: boolean }) => {
  const { userDetails, setUserDetails } = useAuthStore(
    (state) => ({
      userDetails: state.userDetails,
      setUserDetails: state.setUserDetails,
    }),
    shallow
  );
  const toast = useToast();

  const inviteMenu = useCallback((dateSent: number, email: string) => {
    return (
      <Menu>
        <MenuButton
          as={IconButton}
          aria-label="Options"
          icon={<HamburgerIcon />}
          variant="solid"
          color="black"
          size="md"
          padding={0}
          margin={0}
        />
        <MenuList>
          <MenuItem icon={<BsCalendarMonth />}>
            Sent: {formatDateToIsoString(dateSent)}
          </MenuItem>
          <MenuItem
            icon={<DeleteIcon />}
            onClick={() => removeInvitation(email)}
          >
            Remove Invite
          </MenuItem>
        </MenuList>
      </Menu>
    );
  }, []);

  const removeInvitation = async (email: string) => {
    try {
      let response = await axios.get(
        `/api/vercel/get-json?key=${userDetails.wallet}`
      );

      const user = response.data as User;

      const body = {
        ...user,
        invitations: [
          //@ts-ignore
          ...user.invitations.filter(
            (obj: { email: string; dateSent: string }) => obj.email !== email
          ),
        ],
      };

      const payload = {
        key: user.wallet,
        value: body,
      };

      await axios.post(`/api/vercel/set-json`, payload);
      toast({
        title: "Member Invite Removed",
        status: "success",
      });

      //@ts-ignore
      setUserDetails(body);
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
      {userDetails?.invitations?.map(
        (
          invite: {
            email: string;
            dateSent: number;
          },
          index: number
        ) => (
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
                  Sent: {formatDateToIsoString(invite.dateSent)}
                </Text>
                <Text fontSize={isMobileSize ? "sm" : "md"}>
                  {invite.email}
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
                onClick={() => removeInvitation(invite.email)}
              />
            </Flex>
          </Container>
        )
      )}
    </Box>
  );
};

export default MemberInvitationTable;
