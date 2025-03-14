import { Tabs, TabsList, TabsTrigger, TabsContent } from '@radix-ui/react-tabs';
import React, { useState } from 'react';
import { cn } from '~/lib/utils';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { lucario } from 'react-syntax-highlighter/dist/esm/styles/prism';

type Props = {
    filesReferences: {
        fileName: string;
        sourceCode: string;
        summary: string;
    }[];
};

const CodeReferences = ({ filesReferences }: Props) => {
    const [tab, setTab] = useState(filesReferences[0]?.fileName);

    if (filesReferences.length === 0) return null;

    return (
        <div className='max-w-[70vw]'>
            <Tabs value={tab} onValueChange={setTab}>
                <TabsList className='overflow-scroll flex gap-2 bg-gray-200 rounded-md p-1'>
                    {filesReferences.map((file, idx) => (
                        <TabsTrigger
                            key={idx}
                            value={file.fileName}
                            className={cn(
                                'px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap text-muted-foreground',
                                {
                                    'bg-primary text-primary-foreground': tab === file.fileName
                                }
                            )}
                        >
                            {file.fileName}
                        </TabsTrigger>
                    ))}
                </TabsList>
                {filesReferences.map((file, idx) => (
                    <TabsContent key={idx} value={file.fileName} className='max-h-[40vh] overflow-scroll max-w-7xl rounded-md'>
                        <SyntaxHighlighter language='typescript' style={lucario} wrapLongLines={true}>
                            {file.sourceCode}
                        </SyntaxHighlighter>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
};

export default CodeReferences;
