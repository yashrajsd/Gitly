'use client'
import React from 'react'
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '../ui/sidebar'
import { Bot, CreditCard, LayoutDashboard, Plus, Presentation } from 'lucide-react'
import Link from 'next/link'
import { cn } from '~/lib/utils'
import { usePathname } from 'next/navigation'
import { Button } from '../ui/button'

type Props = {}

const items = [
    { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
    { title: "Q&A", url: '/qa', icon: Bot },
    { title: 'Meetings', url: '/meetings', icon: Presentation },
    { title: "Billing", url: '/billing', icon: CreditCard },
]

const projects = [
    {
        name: 'Project 1'
    },
    {
        name: 'Project 2'
    },
    {
        name: 'Project 3'
    },
    {
        name: 'Project 4'
    }
]

const AppSidebar = (props: Props) => {
    const pathname = usePathname();
    const {open} = useSidebar();

    return (
        <Sidebar collapsible='icon' variant='floating'>
            <SidebarHeader>
                <div className='flex items-center gap-2'>
                    {
                        open && (
                            <h1 className='text-xl font-bold text-primary/80'>Gitly</h1>
                        )
                    }
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>
                        Application
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item, idx) => (
                                <SidebarMenuItem key={idx}>
                                    <SidebarMenuButton asChild>
                                        <Link href={item.url} className={cn('flex items-center gap-2', {
                                            'bg-primary text-white': pathname === item.url
                                        }, 'list-none')}>
                                            <item.icon className="w-5 h-5" />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>
                        Your projects
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {
                                projects.map((project, idx) => (
                                    <SidebarMenuItem key={idx}>
                                        <SidebarMenuButton asChild>
                                            <div>
                                                <div className={cn(
                                                    'rounded-sm border size-6 flex items-center justify-center text-sm bg-white text-primary',
                                                    {
                                                        'bg-primary text-white': true
                                                    }
                                                )}>
                                                    {project.name[0]}
                                                </div>
                                                <span>
                                                    {project.name}
                                                </span>
                                            </div>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))
                            }
                            <div className='h-2'></div>
                            <SidebarMenuItem>
                                <Link href={'/create'}>
                                    <Button size={'sm'} variant={'outline'} className='w-fit'>
                                        <Plus/> Create Project
                                    </Button>
                                </Link>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}

export default AppSidebar