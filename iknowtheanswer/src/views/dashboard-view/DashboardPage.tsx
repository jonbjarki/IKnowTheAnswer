import { Heading } from "@chakra-ui/react";

import type { IRootState } from "../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import MatchList from "../../components/MatchList/MatchList";
import { useEffect } from "react";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { getMatches } from "../../redux/features/match/match-slice";

export default function DashboardPage() {
  const thunkDispatch = useDispatch<ThunkDispatch<any, any, any>>();
  useEffect(() => {
    thunkDispatch(getMatches());
  }, [thunkDispatch]);

  return (
    <>
      <MatchList />
    </>
  );
}
