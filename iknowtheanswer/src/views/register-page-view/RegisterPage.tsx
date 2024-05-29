import { useEffect, useState } from "react";
import { registerContainer, registerHeader } from "./styles.css";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Text,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { themeVars } from "../../themes/theme.css";
import {
  getUser,
  registerUser,
} from "../../services/user-service/user-service";
import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "../../redux/store";
import { setUser } from "../../redux/features/user/user-slice";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const isUsernameError = username.length <= 3;
  const isDisplayNameError = displayName.length <= 3;
  const isPasswordError = password.length <= 8;

  const userState = useSelector((state: IRootState) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    async function validateUser() {
      if (Object.keys(userState).length > 0) {
        return;
      }
      const response = await getUser();

      if (response) {
        dispatch(setUser(response));
        navigate("/dashboard");
      }
    }

    validateUser();
  }, [dispatch, navigate, userState]);

  async function submitForm() {
    const response = await registerUser(username, displayName, password);

    if (!response) {
      setErrorMessage("Registration failed");
    } else {
      setErrorMessage("");
      navigate("/");
    }
  }

  return (
    <Box className={registerContainer}>
      <form
        className={registerContainer}
        onSubmit={(e) => {
          e.preventDefault();
          submitForm();
        }}
      >
        <Heading className={registerHeader}>Register</Heading>
        <FormControl isInvalid={isUsernameError} width={300}>
          <FormLabel>Username</FormLabel>
          <Input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {isUsernameError && (
            <FormErrorMessage>Username is too short</FormErrorMessage>
          )}
        </FormControl>
        <FormControl isInvalid={isDisplayNameError}>
          <FormLabel>Display Name</FormLabel>
          <Input
            id="display-name"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
          {isDisplayNameError && (
            <FormErrorMessage>Display Name is too short</FormErrorMessage>
          )}
        </FormControl>
        <FormControl isInvalid={isPasswordError}>
          <FormLabel>Password</FormLabel>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {isPasswordError && (
            <FormErrorMessage>Password is too short</FormErrorMessage>
          )}
        </FormControl>
        <Button marginTop={5} marginBottom={2} variant="outline" type="submit">
          Register
        </Button>
        <Text color={themeVars.colors.red}>{errorMessage}</Text>
      </form>
      <ChakraLink as={RouterLink} to="/" textAlign="center">
        or login
      </ChakraLink>
    </Box>
  );
}
