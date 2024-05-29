import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
} from "@chakra-ui/react";
import { useState } from "react";
import { Question, User } from "../../types";
import { themeVars } from "../../themes/theme.css";
import MatchQuestion from "../../components/CreateMatch/MatchQuestion";
import { createMatch } from "../../services/match-service/match-service";
import { useSelector } from "react-redux";
import { IRootState } from "../../redux/store";
import { useNavigate } from "react-router-dom";

export default function CreateMatch() {
  let user = useSelector((state: IRootState) => state.user);
  let [title, setTitle] = useState("");
  let [questionsErrorMessage, setQuestionsErrorMessage] = useState<string>("");
  let [titleImage, setTitleImage] = useState<string>("");
  let redirect = useNavigate();
  let [questions, setQuestions] = useState<Question[]>([
    {
      title: "",
      options: [
        { value: "", correct: false },
        { value: "", correct: false },
        { value: "", correct: false },
        { value: "", correct: false },
      ],
    },
  ]);

  function addNewQuestion() {
    setQuestions((prev) => [
      ...prev,
      {
        title: "",
        options: [
          { value: "", correct: false },
          { value: "", correct: false },
          { value: "", correct: false },
          { value: "", correct: false },
        ],
      },
    ]);
  }

  function removeQuestion(index: number) {
    setQuestions((prev) => {
      const newQuestions = [...prev];
      newQuestions.splice(index, 1);
      return newQuestions;
    });
  }

  async function saveMatch() {
    if (title.length === 0) {
      return;
    }

    const questionsValid = questions.every((question) => {
      if (question.title.length === 0) {
        return false;
      }
      const optionsValid = question.options.every((option) => {
        return option.value.length > 0;
      });

      return optionsValid;
    });

    if (!questionsValid) {
      setQuestionsErrorMessage(
        "Please fill all the questions and select the correct answer for each question"
      );
      return;
    }

    const res = await createMatch(title, titleImage, questions, user as User);
    if (res) {
      redirect("/dashboard");
      alert("Match created successfully");
    }
  }

  const titleError = title.length === 0;

  return (
    <>
      <Heading marginTop="2em" paddingBottom="1em">
        Create Match
      </Heading>
      <form>
        <FormControl isInvalid={titleError}>
          <FormLabel>Title of the match</FormLabel>
          <Input
            type="text"
            id="title"
            placeholder="Enter title of the match"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <FormErrorMessage>Title is required</FormErrorMessage>
        </FormControl>

        <FormControl>
          <FormLabel marginTop="1em" marginBottom="0.5em">
            Match Image
          </FormLabel>
          <Input
            type="text"
            id="match-image"
            value={titleImage}
            onChange={(e) => setTitleImage(e.target.value)}
          />
          {/* <Input
            type="file"
            accept="image/*"
            id="match-image"
            variant="outline"
            alignItems="center"
            alignContent="center"
            height="fit-content"
            padding="2px"
            value={titleImage}
            onChange={(e) => setTitleImage(e.target.value)}
          /> */}
        </FormControl>
        <Box>
          <Flex
            marginBottom="10px"
            marginTop="2em"
            justifyContent="space-between"
            alignItems="center"
          >
            <Heading>Questions</Heading>
            <Button onClick={() => addNewQuestion()}>Add</Button>
          </Flex>
          {questionsErrorMessage && (
            <Alert status="error" textAlign="center">
              <AlertTitle>{questionsErrorMessage}</AlertTitle>
            </Alert>
          )}

          {questions.map((question, questionIndex) => (
            <MatchQuestion
              key={questionIndex}
              question={question}
              questionIndex={questionIndex}
              setQuestions={setQuestions}
              removeQuestion={removeQuestion}
            />
          ))}
          <Flex justifyContent="flex-end">
            <Button
              marginTop="2em"
              marginBottom="2em"
              bgColor={themeVars.colors.blue}
              onClick={() => saveMatch()}
            >
              Save
            </Button>
          </Flex>
        </Box>
      </form>
    </>
  );
}
