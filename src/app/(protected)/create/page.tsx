'use client'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import useRefetch from '~/hooks/use-refetch'
import { pollCommits } from '~/lib/github'
import { api } from '~/trpc/react'


type FormInput = {
    repoUrl: string,
    projectName: string,
    githubToken: string
}

const Page = () => {
    const { register, handleSubmit, reset } = useForm<FormInput>();
    const createProject = api.project.createProject.useMutation();
    const refetch = useRefetch();

    function onSubmit(data: FormInput) {
        window.alert(JSON.stringify(data));
        createProject.mutate({
            name:data.projectName,
            githubUrl:data.repoUrl,
            githubToken:data.githubToken
        },{
            onSuccess:()=>{
                toast.success("Project created succesfully")
                refetch();
                reset();
            },
            onError:()=>{
                toast.error("Failure creating a project")
            }
        })
        return true;
    }

    return (
        <div className='flex items-center gap-12 h-full justify-center'>
            <img src='/img/repository.jpg' className='h-24 w-auto' />
            <div>
                <div>
                    <h1 className='font-semibold text-sxl'>
                        Link your github Repository
                    </h1>
                    <p className='text-sm text-muted-foreground'>
                        Enter URL of your repository to link to Gitly
                    </p>
                </div>
                <div className='h-4' />
                <div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Input placeholder="Project name" {...register("projectName", { required: true })} className='mb-2' required />
                        <Input placeholder="Github Url" {...register("repoUrl", { required: true })} type='url' className='mb-2' required />
                        <Input placeholder="Github Token" {...register("githubToken")} className='mb-2' />
                        <div className='h-4'/>
                        <Button type='submit' disabled={createProject.isPending}>
                            Create Project
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Page