'use client'
import { useUser } from "@clerk/nextjs"

const Page=()=>{
    const {user} = useUser();
    return(
        <div>
            {user?.firstName} {user?.lastName}
        </div>
    )
}

export default Page