'use client'
import { ExternalLink } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import useProject from '~/hooks/use-project'
import { cn } from '~/lib/utils'
import { api } from '~/trpc/react'

type Props = {}

const CommitLog = (props: Props) => {
    const { projectId, project } = useProject();
    const { data: commits } = api.project.getCommits.useQuery({ projectId })

    return (
        <>
            <ul className='space-y-6'>
                {commits?.map((commit, idx) => {
                    return <li key={idx} className='relative flex gap-x-4'>
                        <div className={cn(
                            idx === commits.length - 1 ? 'h-6' : '-bottom-6',
                            'absolute left-0 top0 flex w-6 justify-center'
                        )}>
                            <div className='w-px translate x-1 bg-gray200'>

                            </div>
                        </div>
                        <>
                            <img src={commit.commitAuthorAvatar} alt='Commit avatar' className='relative mt-4 size-8 flex-none rounded-full bg-gray-50' />
                            <div className='flex-auto rounded-md bg-white p-3 ring-1 ring-inset ring-gray-200'>
                                <div className='flex jsutify-between gap-x-4'>
                                    <Link target='_blank' href={`${project?.githubUrl}/commit/${commit.commitHash}`} className='py-0.5 text-sx leading-5 text-gray-500'>
                                        <span className='font-medium text-gray-900'>
                                            {commit.commitAuthorName}
                                        </span>
                                        <span className='inline-flex items-center ml-5'>
                                            commited
                                            <ExternalLink className='ml-1 size-4' />
                                        </span>
                                    </Link>
                                </div>
                                <span className='font-semibold'>
                                {commit.commitMessage}
                            </span>
                            <pre className='mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-500'>
                                {commit.summary}
                            </pre>
                            </div>
                        </>
                    </li>
                })}
            </ul>
        </>
    )
}

export default CommitLog