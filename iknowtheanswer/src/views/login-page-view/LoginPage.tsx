import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Heading,
  Button,
  Text,
  Box,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  authenticateUser,
  getUser,
} from "../../services/user-service/user-service";
import { themeVars } from "../../themes/theme.css";
import { loginContainer, loginHeader } from "./styles.css";
import { setUser } from "../../redux/features/user/user-slice";
import { UseSelector, useDispatch, useSelector } from "react-redux";
import { IRootState } from "../../redux/store";

export default function LoginPage() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userState = useSelector((state: IRootState) => state.user);

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

  const isUsernameError = name.length <= 0;
  const isPasswordError = password.length <= 0;

  async function submitForm() {
    setErrorMessage("");

    const user = await authenticateUser(name, password);

    if (user) {
      dispatch(setUser(user));
      navigate("/dashboard");
    } else {
      setErrorMessage("Incorrect username or password");
    }
  }

  return (
    <Box className={loginContainer}>
      <form
        className={loginContainer}
        onSubmit={(e) => {
          e.preventDefault();
          submitForm();
        }}
      >
        <Heading className={loginHeader}>Log in</Heading>
        <FormControl isInvalid={isUsernameError} width={300}>
          <FormLabel>Username</FormLabel>
          <Input
            id="username"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {isUsernameError && (
            <FormErrorMessage>Username is required</FormErrorMessage>
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
            <FormErrorMessage>Password is required</FormErrorMessage>
          )}
        </FormControl>
        <Button marginTop={5} marginBottom={2} variant="outline" type="submit">
          Log In
        </Button>
        <Text color={themeVars.colors.red}>{errorMessage}</Text>
      </form>
      <ChakraLink as={RouterLink} to="/register" textAlign="center">
        or register
      </ChakraLink>
    </Box>
  );
}
