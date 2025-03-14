'use client'
import { ExternalLink, Github } from "lucide-react";
import Link from "next/link";
import useProject from "~/hooks/use-project";
import CommitLog from "./commit-log";
import AskQuestionCard from "./ask-question";

const Page = () => {
    const { project } = useProject()
    return (
        <div>
            <div className="flex item-center justify-between flex-wrap gap-y-4">
                {/* Github link */}
                <div className="w-fit rounded-md flex items-center gap-2 bg-primary px-4 py-3">
                    <Github className="size-5 text-white" />
                    <div className="mt-2">
                        <p className="text-sm font-medium text-white">
                            This project is linked to {' '}
                            <Link href={project?.githubUrl ?? ''} className="inline-flex items-center text-white/80 hover:underline">
                                {project?.githubUrl}
                                <ExternalLink className="ml-1 size-4"/>
                            </Link>
                        </p>
                    </div>
                </div>
                <div className="h-4"></div>
                <div className="flex items-center gap-4">
                    TeamMembers
                    InviteButtom
                    ArchieveButton
                </div>
                
            </div>
            <div className="mt-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
                    <AskQuestionCard/>
                    MeetingCard
                </div>
            </div>
            <div className="mt-8">
                <CommitLog/>
            </div>
        </div>
    )
}

export default Page