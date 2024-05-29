import {
  Avatar,
  Flex,
  List,
  ListItem,
  Text,
  Box,
  Stack,
  StackItem,
  Heading,
} from "@chakra-ui/react";
import { UserResults } from "../../types";
import { themeVars } from "../../themes/theme.css";

export default function ResultsScoreboard({
  scoreboard,
}: {
  scoreboard: UserResults[];
}) {
  console.log("scoreboard", scoreboard);
  return (
    <>
      <Heading marginTop="5em" marginBottom="1em" size="md">
        Scoreboard
      </Heading>
      <Stack
        gap="10px"
        bgColor={themeVars.colors.grey}
        padding="1em"
        fontWeight="bold"
      >
        {scoreboard.map((userResult, index) => (
          <StackItem key={userResult.user.id}>
            <Flex justifyContent="space-between" alignItems="center">
              <Flex alignItems="center" gap="15px">
                <Text>#{index + 1}</Text>
                <Avatar src={userResult.user.avatar} />
                <Text>{userResult.user.displayName}</Text>
              </Flex>
              <Text>{userResult.score} pts</Text>
            </Flex>
          </StackItem>
        ))}
      </Stack>
    </>
  );
}
