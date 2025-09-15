'use client'
import React from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '~/components/ui/sheet'
import useProject from '~/hooks/use-project'
import { api } from '~/trpc/react'
import AskQuestionCard from '../dashboard/ask-question'

type Props = {}

const Page = (props: Props) => {
  const { projectId } = useProject();
  const [questionIndex, setQuestionIndex] = React.useState(0);
  const { data: questions } = api.project.getQuestions.useQuery({ projectId: projectId })
  const question = questions?.[questionIndex]

  return (
    <Sheet>
      <AskQuestionCard />
      <div className='h-4'></div>
      <h1 className='text-xl font-semibold'>Saved Questions</h1>
      <div className='h-2'></div>
      <div className='flex flex-col gap-2'>
        {
          questions?.map((question, index) => {
            return <React.Fragment key={index}>
              <SheetTrigger onClick={()=>setQuestionIndex(index)}>
                <div className='flex items-center gap-4 bg-white rounded-lg p-4 shadow border'>
                  <img className='rounded-full' height={30} width={30} src={question.user.imageUrl??""}/>
                  <div className='text-left flex flex-col'>
                    <div className='flex items-center gap-2'>
                      <p className='text-gray-700 line-clamp-1 text-lg font-medium'>
                        {question.question}
                      </p>
                      <span className='text-xs text-gray-400 whitespace-nowrap'>
                        {question.createdAt.toLocaleDateString()}
                      </span>
                    </div>
                    <p className='text-gray-500 line-clamp-1 text-sm'>
                      {question.answer}
                    </p>
                  </div>
                </div>
              </SheetTrigger>
            </React.Fragment>
          })
        }
      </div>
      {question && (
        <SheetContent className='sm:max-w-[80vw]'>
          <SheetHeader>
            <SheetTitle>
              {question.question}
            </SheetTitle>
          </SheetHeader>
        </SheetContent>
      )}
    </Sheet>
  )
}

export default Page