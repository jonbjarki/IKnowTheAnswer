import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Match } from "../../../types";
import { fetchWithCredentials } from "../../../utilities/fetch-utilities";

export const getMatches = createAsyncThunk("matches/getMatches", async ()=> {
    const response = await fetchWithCredentials("matches");
    const matches = (await response.json()) as Match[];
    return matches;
});

type MatchState = {
    status: "loading" | "idle";
    error: string | null;
    matches: Match[];
}

const initialState: MatchState = {
    status: "idle",
    error: null,
    matches: [],
}

export const matchSlice = createSlice({
    name: "matches",
    initialState,
    reducers: {
        setMatches: (state, action)=> {
            state.matches = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getMatches.pending, (state)=> {
            state.status = "loading";
            state.error = null;
        });

        builder.addCase(getMatches.fulfilled, (state, action) => {
            state.matches = action.payload;
            state.error = null;
            state.status = "idle";
        });

        builder.addCase(getMatches.rejected, (state, action) => {
            if (action.payload) {
                state.error = "Could not retrieve matches";
            }
        });
    }
});

export const {setMatches} = matchSlice.actions;

export default matchSlice.reducer;