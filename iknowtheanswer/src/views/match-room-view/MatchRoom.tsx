import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { IRootState } from "../../redux/store";
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Flex,
  Grid,
  GridItem,
  Heading,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { socket } from "../../services/socket-service/socket-service";
import { setMatches } from "../../redux/features/match/match-slice";
import { User } from "../../types";
import { themeVars } from "../../themes/theme.css";
export default function MatchRoom() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const matches = useSelector((state: IRootState) => state.match.matches);
  const match = useSelector((state: IRootState) =>
    state.match.matches.find((match) => match._id === id)
  );
  const user = useSelector((state: IRootState) => state.user);

  useEffect(() => {
    socket.on("joinmatch", (user) => {
      console.log("User joined match", user);
      dispatch(
        setMatches(
          matches.map((m) =>
            m._id === id ? { ...m, players: [...m.players, user] } : m
          )
        )
      );
    });

    socket.on("leavematch", (user) => {
      console.log("User left match", user);
      dispatch(
        setMatches(
          matches.map((m) =>
            m._id === id
              ? {
                  ...m,
                  players: m.players.filter((player) => player.id !== user.id),
                }
              : m
          )
        )
      );
    });

    return () => {
      socket.off("joinmatch");
      socket.off("leavematch");
    };
  }, [dispatch, id, matches]);

  useEffect(() => {
    socket.on("startmatch", () => {
      console.log("Match started");
      navigate(`/game/${id}`);
    });

    return () => {
      socket.off("startmatch");
    };
  }, [id, navigate]);

  function leaveMatch() {
    console.log("Leaving match");
    socket.emit("leavematch", match!._id, user);
    dispatch(
      setMatches(
        matches.map((m) =>
          m._id === id
            ? {
                ...m,
                players: m.players.filter((player) => player.id !== user.id),
              }
            : m
        )
      )
    );
    navigate("/dashboard");
  }

  function startMatch() {
    if (!match) {
      console.error("Match is undefined");
      return;
    }
    if (match.players.length < 2) {
      alert("Need at least 2 players to start match");
      return;
    }
    if (match.owner.id !== user.id) {
      alert("Only the match owner can start the match");
      return;
    }
    console.log("Starting match", match._id);
    socket.emit("startmatch", match._id);
  }

  if (!match) {
    return <Box>Loading...</Box>;
  }
  return (
    <Box marginTop="3em">
      <Flex justifyContent="space-between" marginBottom="5em">
        <Heading>Waiting for players to join...</Heading>
        <ButtonGroup gap={2}>
          <Button colorScheme="red" onClick={() => leaveMatch()}>
            Leave
          </Button>
          <Button
            colorScheme="blue"
            isDisabled={match.players.length < 2}
            onClick={() => startMatch()}
          >
            Start Match
          </Button>
        </ButtonGroup>
      </Flex>
      <Grid templateColumns="repeat(2,1fr)" gap={6} placeContent="center">
        {match.players.map((player: User) => (
          <GridItem
            key={player.id}
            colSpan={1}
            alignContent="center"
            textAlign="center"
            height={300}
            w="100%"
            bg={themeVars.colors.grey}
          >
            <Avatar
              width={150}
              height={150}
              marginBottom="1em"
              key={player.id}
              src={player.avatar}
            />
            <Heading>{player.displayName} is in the house!</Heading>
          </GridItem>
        ))}
      </Grid>
    </Box>
  );
}
