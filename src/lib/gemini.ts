import { GoogleGenerativeAI } from "@google/generative-ai"
import { Document } from "@langchain/core/documents";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const AISumariseCommit = async (diff: string) => {
    const response = await model.generateContent([

        // Prompt below 
        `You are an expert programmer, and you are trying to summarize a git diff,
    reminders about the git diff format:
    For every file, there are a few metadata lines,like(for example):
    \`\`\`
    diff --git a/lib/index.js b/lib/index,js
    index aadf691..bfef003 100644
    --- a/lib/index.js
    +++ b/lib/index.js
    \`\`\`
    this means that \`lib/index.js\` was modified in this commit, Note this is only an example.
    then there is a specifier of the lines that were modified.
    A line starting with \`+\` means it was added.
    A line that starting with \`-\` means that line was deleted.
    A line that starts withe neither \`+\` nor \`-\` is code given for context and better understanding.
    It is not part of the diff.
    [...]
    EXAMPLE SUMMARY COMMENTS:
    \`\`\`
    *Raised the amount of returned recordings from \`10\` to \`100\` [packages/server/recordings_api.ts], [packages/server/constants.ts]
    *Fixed a typo in the github action name [.github/workflos//gpt-commit-summarizer.yml]
    *Moved the \`octokit\` initialization to a separate file [src/octokit.ts],[src/index.ts]
    *Added an openAI API for completions [packages/utils/apis/openai.ts]
    *Lowered numeric tolerance for test files
    \`\`\`
    Most commits will have less comments than this examples list.
    The last comment does not include the file names.
    because there were more than two relevant files in the hypothetical commit.
    Do not include prts of the example in your summary.
    It is given only as an example of appropriate comments.`
        ,
        // Input context
        `Please summarise the following diff file: \n\n${diff}`
    ])

    return response.response.text();
}

export async function summariseCode(doc: Document) {
    console.log("Getting summary for: ", doc.metadata.source);
    try{
        const code = doc.pageContent.slice(0, 10000)
    const response = await model.generateContent([
        `You are an intelligent senior software engineer who specialises in onboarding junior software engineer onto projects`,
        `You re onboarding a junior software engineer and explaining to them the purposes of the ${doc.metadata.source} file here in the code:
        ---
        ${code}
        ---
        Give a summry no more than 100 words of the code
        `
    ])
    return response.response.text();
    }catch(err){
        return ""
    }
}

export async function generateEmbedding(summary: string) {
    const model = genAI.getGenerativeModel({
        model: "text-embedding-004"
    })
    const result = await model.embedContent(summary);
    const embedding = result.embedding;
    return embedding.values;
}

// console.log(await generateEmbedding("Hello World"))