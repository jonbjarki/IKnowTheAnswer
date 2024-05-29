import { Avatar, Box, Flex, Grid, GridItem, Heading } from "@chakra-ui/react";
import { UserResults } from "../../../types";
import { podium } from "./styles.css";

export default function Podium({ scoreboard }: { scoreboard: UserResults[] }) {
  console.log("podium", scoreboard);
  return (
    <Box marginTop="4em">
      <Grid templateColumns="1fr 1fr 1fr" columnGap={2} alignItems="flex-end">
        <GridItem textAlign="center">
          {scoreboard[2] && (
            <Avatar src={scoreboard[2].user.avatar} size="xl" />
          )}
          <Box className={podium}>
            <Heading>3</Heading>
          </Box>
        </GridItem>
        <GridItem textAlign="center">
          {scoreboard[0] && (
            <Avatar src={scoreboard[0].user.avatar} size="xl" />
          )}
          <Box className={podium} height="20em">
            <Heading>1</Heading>
          </Box>
        </GridItem>
        <GridItem textAlign="center">
          {scoreboard[1] && (
            <Avatar src={scoreboard[1].user.avatar} size="xl" />
          )}
          <Box className={podium} height="14em">
            <Heading>2</Heading>
          </Box>
        </GridItem>
      </Grid>
    </Box>
  );
}
