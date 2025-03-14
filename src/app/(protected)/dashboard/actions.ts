'use server'
import { streamText } from 'ai'
import { createStreamableValue } from 'ai/rsc'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { generateEmbedding } from '~/lib/gemini'
import { db } from '~/server/db'
const google = createGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY
})

export async function askQuestion(question: string, projecId: string) {
    const stream = createStreamableValue();

    const queryVector = await generateEmbedding(question)
    const vectorQuery = `[${queryVector.join(',')}]`
    console.log("VectorQuery : ",vectorQuery);

    const result = await db.$queryRaw`
    SELECT "fileName", "sourceCode", "summary",
           1 - ("summaryEmbedding" <=> ${vectorQuery}::vector) AS similarity
    FROM "SourceCodeEmbedding"
    WHERE 1 - ("summaryEmbedding" <=> ${vectorQuery}::vector) > 0.5
      AND "projectId" = ${projecId} 
    ORDER BY similarity DESC
    LIMIT 10
    `as { fileName: string; sourceCode: string, summary: string, similarity: number }[]

    let context = ''
    
    for (const doc of result) {
        context += `source: ${doc.fileName}\ncode content: ${doc.sourceCode}\n summary of file: ${doc.summary}\n\n`
    }
    (async () => {
        const { textStream } = await streamText({
            model: google("gemini-1.5-flash"),
            prompt: `
            You are a ai code assistnt who answers questions about the codebase. Your target audience is a technical intern with minimum experience
            AI assistant is a brand new, powerful, human-like artifical intelligence.
            The triats of AI include expert knowledge, helpfulness, cleverness and articulateness.
            AI is a well-behaved and well-mannered individual.
            AI is always friendly, kind and inspiring and he is eager to provide vivid and thoughtful responses to the user.
            AI has the sum of all knowledge in their brain and is able to accurately answer nearly any question about any topic in coding specific domain.
            If question asked about code or a specific file, AI will provide the detailed answer, giving step by step instructions.
            START CONTEXT BLOCK
            ${context}
            END OF CONTEXT BLOCK

            START OF QUESTION
            ${question}
            END OF QUESTION
            AI assistant will take into account any CONTEXT BLOCK thaat is provided in a conversation.
            If the context does not provide the answer ot the question, the AI assistant will say, "I'm sorry, but I don't know the answer to the asked question"
            AI assitant will not apologize for previous responses, but instead will indicate new information was gained.
            AI assistant will not invent anything that is not drawn directly from the context.
            Answer in markdown syntax, with code snippets if needed. Be as detailed as possible when answering.
            `,
        })
        for await (const delta of textStream) {
            stream.update(delta)
        }
        stream.done();
    })()
    console.log("Context : ",context)
    console.log("projectID : ",projecId)
    return {
        output: stream.value,
        filesReferences: result
    }
}