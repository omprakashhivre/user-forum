"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { PlusCircle, LogOut, User, User2 } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import axiosInstance from "@/lib/axios-instance"
import { toast } from "sonner"

export default function Navbar({name, email, id}: {name:string, email:string, id:string}) {
  const [isLoggedIn, setIsLoggedIn] = useState(true)
  const getDisplayName = (name:string) => {
    if(name){
      return name.split(" ").map((str:string) => str.charAt(0).toLocaleUpperCase()).join("")
    }
    else return "X"
  }
  const router = useRouter()

  const handleLogout = async () => {
    try {
      setIsLoggedIn(false)
      sessionStorage.clear()
      await axiosInstance.post("/api/auth/logout")
      router.push("/")      
      toast("Logged out successfully.")
    } catch (error:any) {
      toast(error.response ? error.response.data.message : error.message)
    }
  }

  const handleLogin = () => {
    setIsLoggedIn(true)
  }

  return (
    <nav className="border-b border-border/40 px-4">
      <div className="flex h-16 items-center justify-between border-b">
        <Link href="/home" className="flex items-center gap-2">
          <span className="text-xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
            User Forum
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <Button variant="ghost" className="gap-2" onClick={() => router.push("/create-forum")}>
                <PlusCircle className="h-4 w-4" />
                <span>New Forum</span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      {/* <AvatarImage src="/placeholder.svg?height=32&width=32" alt="@user" /> */}
                      <AvatarFallback>{getDisplayName(name) === "X" ? <User2 /> : getDisplayName(name).slice(0,2)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push("/profile")}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            ""
          )}
        </div>
      </div>
    </nav>
  )
}
