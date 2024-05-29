import {
  Heading,
  Stack,
  FormControl,
  FormLabel,
  Input,
  RadioGroup,
  Radio,
  Button,
  Box,
} from "@chakra-ui/react";
import { themeVars } from "../../themes/theme.css";
import { Question } from "../../types";

export default function MatchQuestion({
  question,
  questionIndex,
  setQuestions,
  removeQuestion,
}: {
  question: Question;
  questionIndex: number;
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
  removeQuestion: Function;
}) {
  return (
    <Box marginTop="1em" key={questionIndex}>
      <Heading size="md" marginBottom="10px">
        Question {questionIndex + 1}
      </Heading>
      <Box backgroundColor="whitesmoke" padding="1.5em">
        <Stack spacing={4}>
          <FormControl>
            <FormLabel>Title of the question</FormLabel>
            <Input
              type="text"
              id="question-title"
              value={question.title}
              onChange={(e) => {
                setQuestions((prev) => {
                  const newQuestions = [...prev];
                  newQuestions[questionIndex].title = e.target.value;
                  return newQuestions;
                });
              }}
              borderRadius={0}
              borderColor="black"
            />
          </FormControl>
          <FormControl>
            <Stack spacing={4}>
              {question.options.map((option, optionIndex) => (
                <FormControl key={optionIndex}>
                  <RadioGroup
                    onChange={(nextValue) => {
                      setQuestions((prev) => {
                        const newQuestions = [...prev];
                        newQuestions[questionIndex].options.forEach(
                          (option, index) => {
                            option.correct = index === parseInt(nextValue);
                          }
                        );
                        return newQuestions;
                      });
                    }}
                    value={question.options
                      .findIndex((option) => option.correct)
                      .toString()}
                  >
                    <FormLabel fontSize="15px">
                      Answer {optionIndex + 1}
                    </FormLabel>
                    <Input
                      type="text"
                      id={`option-${optionIndex}`}
                      value={option.value}
                      onChange={(e) => {
                        setQuestions((prev) => {
                          const newQuestions = [...prev];
                          newQuestions[questionIndex].options[
                            optionIndex
                          ].value = e.target.value;
                          return newQuestions;
                        });
                      }}
                      borderRadius={0}
                      borderColor="black"
                    />
                    <Radio value={`${optionIndex}`}>Right answer?</Radio>
                  </RadioGroup>
                </FormControl>
              ))}
            </Stack>
          </FormControl>
          <Button
            bgColor={themeVars.colors.red}
            color={themeVars.colors.white}
            onClick={() => removeQuestion(questionIndex)}
          >
            Remove
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
