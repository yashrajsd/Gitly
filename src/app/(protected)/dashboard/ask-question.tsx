'use client'
import React, { useState } from 'react'
import MDEditor from '@uiw/react-md-editor'
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog';
import { Textarea } from '~/components/ui/textarea';
import useProject from '~/hooks/use-project'
import { askQuestion } from './actions';
import { readStreamableValue } from 'ai/rsc';
import CodeReferences from './code-references';

const AskQuestionCard = () => {
    const { project } = useProject();
    const [question, setQuestion] = useState('')
    const [open, setOpen] = useState(false);
    const [loading,setLoading] = useState(false)
    const [answer,setAnswer] = useState('')
    const [fileReferences,setFileReferences] = useState<{fileName:string;sourceCode:string;summary:string}[]>([])

    const onsubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!project?.id)return;
        setOpen(true)
        setLoading(true)
        const {output,filesReferences} = await askQuestion(question,project?.id)
        setFileReferences(filesReferences)
        for await (const delta of readStreamableValue(output)){
            if(delta){
                setAnswer(ans=>ans+delta)
            }
        }
        setLoading(false);
    }

    const handleQuestion =()=>{
        setOpen(false);
        setAnswer('');
        setQuestion('')
        setFileReferences([])
    }

    return (
        <>

            <Dialog open={open} onOpenChange={handleQuestion}>
                <DialogContent className='sm:max-w-[80vw]'>
                    <DialogHeader>
                        <DialogTitle className="font-medium">Gitly</DialogTitle>
                    </DialogHeader>
                    <MDEditor.Markdown source={answer} className='max-w-[70vw] !h-full max-h-[40vh] overflow-scroll'/>
                    <div className='h-4'/>
                    <CodeReferences filesReferences={fileReferences}/>
                </DialogContent>
            </Dialog>

            <Card className='relative col-span-3'>
                <CardHeader>
                    <CardTitle>Ask a question</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={onsubmit}>
                        <div>
                            <Textarea
                                placeholder='which file should I edit to change the home page?'
                                onChange={(e) => { setQuestion(e.target.value) }}
                                value={question}
                            />
                            <Button type='submit' className='mt-5' disabled={loading}>
                                Ask Gitly
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </>
    )
}

export default AskQuestionCard