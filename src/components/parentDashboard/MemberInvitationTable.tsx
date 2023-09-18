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
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>Email</Th>
          <Th></Th>
        </Tr>
      </Thead>
      <Tbody>
        {/* @ts-ignore */}
        {userDetails?.invitations?.map(
          (
            invite: {
              email: string;
              dateSent: number;
            },
            index: number
          ) => (
            <Tr key={index}>
              <Td fontSize={isMobileSize ? "sm" : "md"}>{invite.email}</Td>

              <Td>
                <Flex justify="center">
                  {inviteMenu(invite.dateSent, invite.email)}
                </Flex>
              </Td>
            </Tr>
          )
        )}
      </Tbody>
    </Table>
  );
};

export default MemberInvitationTable;
