import {
  Box,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  Heading,
  Image,
  Text,
} from "@chakra-ui/react";
import { Match, User } from "../../types";
import { useNavigate } from "react-router-dom";
import { socket } from "../../services/socket-service/socket-service";

export default function MatchCard({
  matches,
  user,
  match,
}: {
  matches: Match[];
  user: Partial<User>;
  match: Match;
}) {
  function getStatus(status: "not-started" | "started" | "finished") {
    switch (status) {
      case "not-started":
        return "Not started";
      case "started":
        return "Started";
      case "finished":
        return "Finished";
    }
  }
  const navigate = useNavigate();

  function joinMatch() {
    if (match.status === "started" || match.status === "finished") return;
    if (match.players.length >= 4) {
      alert("Match is full");
      return;
    }
    if (
      matches.some(
        (m) =>
          m.players.some((p) => p.id === user.id) &&
          m._id !== match._id &&
          m.status !== "finished"
      )
    ) {
      alert("You must leave your current match to join another match.");
      return;
    }
    socket.emit("joinmatch", match._id, user);
    navigate(`/match/${match._id}`);
  }

  return (
    <Card as="button" minW={300} onClick={() => joinMatch()}>
      <CardHeader>
        <Heading size="md">{match.title}</Heading>
      </CardHeader>
      <CardBody>
        <Box>
          <Image
            objectFit="contain"
            src={match.titleImage}
            alt="Matchroom cover image"
            width={200}
            height={200}
          />
        </Box>
      </CardBody>
      <CardFooter width="100%">
        <Flex justifyContent="space-between" width="100%">
          <Text>{match.players.length}/4 players</Text>
          <Text>{getStatus(match.status)}</Text>
        </Flex>
      </CardFooter>
    </Card>
  );
}
