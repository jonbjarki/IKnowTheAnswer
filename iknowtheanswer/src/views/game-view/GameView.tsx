import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { IRootState } from "../../redux/store";
import { useEffect, useState } from "react";
import { socket } from "../../services/socket-service/socket-service";
import { setMatches } from "../../redux/features/match/match-slice";
import {
  Avatar,
  Box,
  Flex,
  Grid,
  GridItem,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";
import { questionOption } from "./style.css";
import { Match, User } from "../../types";
import { themeVars } from "../../themes/theme.css";
import GameResults from "../../components/Game/GameResults";

export default function GameView() {
  let [timeLeft, setTimeLeft] = useState<number>(10);
  let [answered, setAnswered] = useState<User[]>([]);
  let [alreadyAnswered, setAlreadyAnswered] = useState<boolean>(false);
  let [currentAnswer, setCurrentAnswer] = useState<number>(-1);
  let [showAnswers, setShowAnswers] = useState<boolean>(false);
  const { id } = useParams();
  const dispatch = useDispatch();
  const match = useSelector((state: IRootState) =>
    state.match.matches.find((match) => match._id === id)
  );
  const matches = useSelector((state: IRootState) => state.match.matches);
  const user = useSelector((state: IRootState) => state.user);

  function answerQuestion(optionIndex: number) {
    if (alreadyAnswered) {
      return;
    }
    socket.emit("answer", match, user, optionIndex, timeLeft);
    setAlreadyAnswered(true);
    setCurrentAnswer(optionIndex);
  }

  useEffect(() => {
    socket.on("updatetimer", (counter) => {
      console.log("Time left", counter);
      setTimeLeft(counter);
    });

    socket.on("nextquestion", (questionNumber) => {
      console.log("Next question", questionNumber);
      setAnswered([]);
      setAlreadyAnswered(false);
      setShowAnswers(false);
      dispatch(
        setMatches(
          matches.map((m) =>
            m._id === id ? { ...m, currentQuestion: questionNumber } : m
          )
        )
      );
    });

    socket.on("finishedgame", (resMatch: Match) => {
      dispatch(
        setMatches(matches.map((m) => (m._id === resMatch._id ? resMatch : m)))
      );
    });

    socket.on("answer", (user) => {
      console.log("User answered", user);
      setAnswered((prev) => [...prev, user]);
    });

    socket.on("answers", (answers) => {
      dispatch(
        setMatches(matches.map((m) => (m._id === id ? { ...m, answers } : m)))
      );
      setShowAnswers(true);
    });

    return () => {
      socket.off("updatetime");
      socket.off("nextquestion");
      socket.off("finishedgame");
      socket.off("answer");
    };
  }, [dispatch, id, matches]);

  if (match?.status === "finished") {
    return <GameResults {...match} />;
  }

  return match ? (
    <Box marginTop="5em">
      <Flex justifyContent="space-between" marginBottom="2em">
        <Heading>Question {match.currentQuestion}</Heading>
        <Heading>Time left: {timeLeft}</Heading>
      </Flex>
      <Text>{match.questions[match.currentQuestion - 1]?.title}</Text>
      {answered.length > 0 && (
        <Flex gap={4} marginTop={8} marginBottom={8}>
          {answered.map((user, index) => (
            <Avatar key={index} width="80px" height="80px" src={user.avatar} />
          ))}
        </Flex>
      )}

      <Grid templateColumns="repeat(2,1fr)" gap={4} marginTop="1em">
        {match.questions[match.currentQuestion - 1]?.options.map(
          (option, index) => {
            return (
              <GridItem
                as="button"
                key={index}
                padding="1em"
                h="200px"
                border="1px solid black"
                className={questionOption}
                onClick={() => answerQuestion(index)}
                position="relative"
              >
                <Flex position="absolute" top={2} left={2} gap={2}>
                  {showAnswers &&
                    match.answers.map((answer, ind) =>
                      answer.answer === index ? (
                        <Avatar
                          key={ind}
                          width="60px"
                          height="60px"
                          src={answer.user.avatar}
                        />
                      ) : null
                    )}
                </Flex>
                <Box position="absolute" top={2} right={2}>
                  {showAnswers && option.correct && currentAnswer === index && (
                    <Text color={themeVars.colors.green}>Correct!</Text>
                  )}
                  {showAnswers &&
                    !option.correct &&
                    currentAnswer === index && (
                      <Text color={themeVars.colors.red}>Incorrect!</Text>
                    )}
                </Box>
                <Heading size="md">{option.value}</Heading>
              </GridItem>
            );
          }
        )}
      </Grid>
    </Box>
  ) : (
    <div>Loading...</div>
  );
}
