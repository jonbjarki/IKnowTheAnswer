import { Question, User } from "../../types";
import { fetchWithCredentials } from "../../utilities/fetch-utilities";

export async function createMatch(title: string, titleImage: string, questions: Question[], owner: User) {
    const response = await fetchWithCredentials("matches", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, titleImage, questions, owner })
    });

    if (response.ok) {
        return await response.text();
    }
}