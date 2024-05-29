import { Box, Heading } from "@chakra-ui/react";
import { Match, UserResults } from "../../types";
import { useEffect, useState } from "react";
import Podium from "./Podium/Podium";
import ResultsScoreboard from "./ResultsScoreboard";

export default function GameResults(match: Match) {
  let [scoreboard, setScoreboard] = useState<UserResults[]>([]);
  console.log(match);
  useEffect(() => {
    let scores: { [key: string]: UserResults } = {};
    match.players.forEach((player) => {
      scores[player.id] = {
        user: player,
        score: 0,
      };
    });

    match.answers.forEach((answer) => {
      if (
        answer.answer ===
        match.questions[answer.question - 1].options.findIndex(
          (option) => option.correct
        )
      ) {
        // Checks if the answer is correct
        scores[answer.user.id].score += (10 - answer.secondsLeft) * 10;
      }
    });
    console.log(scores);
    setScoreboard(Object.values(scores).sort((a, b) => b.score - a.score));
  }, [match.answers, match.players, match.questions]);
  console.log(scoreboard);

  return (
    <Box marginTop="4em">
      <Heading>Game summary</Heading>
      <Podium scoreboard={scoreboard} />
      <ResultsScoreboard scoreboard={scoreboard} />
    </Box>
  );
}
