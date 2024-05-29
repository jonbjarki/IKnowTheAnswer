import { useSelector } from "react-redux";
import { IRootState } from "../../redux/store";
import MatchCard from "../MatchCard/MatchCard";
import { Button, Link as ChakraLink, Flex } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

export default function MatchList() {
  const matches = useSelector((state: IRootState) => state.match);
  const userState = useSelector((state: IRootState) => state.user);
  if (!matches.matches || !userState.username) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <Flex justifyContent="center">
        <ChakraLink as={RouterLink} to="/create">
          <Button margin="0.5em" size="lg" colorScheme="cyan">
            Create
          </Button>
        </ChakraLink>
      </Flex>
      <Flex flexWrap="wrap" justifyContent="center" gap={5}>
        {matches.matches.length === 0 && <div>No matches found</div>}
        {matches.matches.map((match) => {
          return (
            <MatchCard
              key={match._id}
              user={userState}
              matches={matches.matches}
              match={match}
            />
          );
        })}
      </Flex>
    </>
  );
}
