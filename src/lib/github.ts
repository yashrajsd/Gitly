import {Octokit} from 'octokit'
import { db } from '~/server/db';
import axios from 'axios'
import { AISumariseCommit } from './gemini';
export const octokit = new Octokit({
    auth:process.env.GITHUB_TOKEN
})
// This for chnge 1
// const githubUrl = "https://github.com/yashrajsd/Parcel-Pilot"

type Response ={
    commitHash:string;
    commitMessage:string;
    commitAuthorName:string;
    commitAuthorAvatar:string;
    commitDate:string;
}

const getCommitHashes = async (githubUrl:string):Promise<Response[]>=>{
    const [owner,repo] = githubUrl.split("/").slice(-2);
    if(!owner || !repo){
        throw new Error("Invalid github url")
    }
    const {data} = await octokit.rest.repos.listCommits({
        owner:owner,
        repo:repo
    })
    const sortedCommits = data.sort((a:any,b:any)=>new Date(b.commit.author.date).getTime()-new Date(a.commit.author.date).getTime()) as any[]
    return sortedCommits.slice(0,10).map((commit:any)=>(
        {
            commitHash:commit.sha as string,
            commitMessage:commit.commit.message ?? "",
            commitAuthorName:commit.commit?.author?.name ?? "",
            commitAuthorAvatar:commit?.author?.avatar_url ?? "",
            commitDate:commit.commit?.author?.date ?? ""
        }
    ))
}

export const pollCommits = async (projectId:string)=>{
    const {project,githubUrl} =await fetchProjectGithubUrl(projectId);
    const commitHashes = await getCommitHashes(githubUrl);
    const unprocessedCommits = await fillerUnprocessedCommits(projectId,commitHashes)
    const summaryResponses = await Promise.allSettled(unprocessedCommits.map(commit=>{
        return summariseCommit(githubUrl,commit.commitHash)
    }))
    const summaries = summaryResponses.map((response)=>{
        if(response.status=='fulfilled'){
            return response.value as string;
        }
    })
    const commits = await db.commit.createMany({
        data:summaries.map((summary,indx)=>{
            console.log(`Processing commit ${indx}...`)
            return {
                projectId:projectId,
                commitHash:unprocessedCommits[indx]!.commitHash,
                commitMessage:unprocessedCommits[indx]!.commitMessage,
                commitAuthorName:unprocessedCommits[indx]!.commitAuthorName,
                commitAuthorAvatar:unprocessedCommits[indx]!.commitAuthorAvatar,
                commitDate:unprocessedCommits[indx]!.commitDate,
                summary:summary!
            }
        })
    })
    return commits
}

async function summariseCommit(githubUrl:string,commitHash:string){
    // wip: get the diff and pass it to the model
    const {data} = await axios.get(`${githubUrl}/commit/${commitHash}.diff`,{
        headers:{
            Accept:'application/vnd.github.v3.diff'
        }
    })
    return await AISumariseCommit(data) || ""
}

async function fetchProjectGithubUrl(projectId:string) {
    const project = await db.project.findUnique({
        where:{id:projectId},
        select:{
            githubUrl:true
        }
    })
    if(!project?.githubUrl){
        throw new Error("Project has no github url");
    }
    return {project,githubUrl:project?.githubUrl}
}

async function fillerUnprocessedCommits(projectId:string,commitHashes:Response[]){
    const processedCommits = await db.commit.findMany({
        where:{
            projectId
        }
    })
    const unprocessedCommits = commitHashes.filter((commit)=>!processedCommits.some((processedCommit)=>processedCommit.commitMessage===commit.commitMessage))
    return unprocessedCommits;
}

