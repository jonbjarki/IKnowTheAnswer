import {
  Avatar,
  Box,
  Button,
  Container,
  HStack,
  Heading,
  Stack,
  VStack,
} from "@chakra-ui/react";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "../redux/store";
import { useEffect } from "react";
import { getUser, logoutUser } from "../services/user-service/user-service";
import { setUser } from "../redux/features/user/user-slice";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { getMatches } from "../redux/features/match/match-slice";
import { fetchWithCredentials } from "../utilities/fetch-utilities";

export default function MainLayout() {
  const userState = useSelector((state: IRootState) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const thunkDispatch = useDispatch<ThunkDispatch<any, any, any>>();

  useEffect(() => {
    async function validateUser() {
      if (Object.keys(userState).length > 0) {
        return;
      }
      const response = await getUser();

      if (!response) {
        navigate("/");
      } else {
        dispatch(setUser(response));
      }
    }

    validateUser();
    thunkDispatch(getMatches());
  }, [dispatch, navigate, thunkDispatch, userState]);

  async function Logout() {
    const response = await logoutUser();
    if (response) {
      dispatch(setUser({}));
      navigate("/");
    }
  }

  return (
    <HStack height="100%">
      <Stack
        gap={4}
        height="100%"
        w="15%"
        bgColor="whitesmoke"
        alignItems="center"
        paddingTop="4em"
      >
        <Avatar src={userState.avatar} size="xl" />
        <Heading size="md">{userState.displayName}</Heading>
        <Button colorScheme="red" onClick={() => Logout()}>
          Logout
        </Button>
      </Stack>
      <Container height="100%" maxW="60%" overflowY="auto">
        <Outlet />
      </Container>
    </HStack>
  );
}
