'use client'

import Link from "next/link"
import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { DotIcon, Edit, EllipsisVertical, Ghost, MessageSquare, MoreHorizontal, ThumbsUp, Trash2 } from "lucide-react"
import { timeAgo } from "@/lib/utils"
import axiosInstance from "@/lib/axios-instance"
import type { Forum } from "@/lib/data"
import { Button } from "../ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface ForumCardProps {
  forum: Forum
  setForumDeleted: (id: string) => void
}

export function ForumCard({ forum, setForumDeleted }: ForumCardProps) {
  const forumTags = forum?.tags ? JSON.parse(forum?.tags) as any[] : []
  const router = useRouter()
  const [time, setTime] = useState("")
  const [user, setUser] = useState<{ [key: string]: string }>(forum.user)
  const [loadStatus, setLoadStatus] = useState<"loading" | "success" | "failed" | "">("")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  // Fetch user info once
  // useEffect(() => {
  //   const fetchUser = async () => {
  //     setLoadStatus("loading")
  //     try {
  //       const token = sessionStorage.getItem("access_token")
  //       if (!token) throw new Error("No access token found")

  //       const res = await axiosInstance.get("/api/v1/user/" + forum.userId, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       })

  //       setUser(res.data.data)
  //       setLoadStatus("success")
  //     } catch (err) {
  //       setLoadStatus("failed")
  //     }
  //   }

  //   fetchUser()
  // }, [forum.userId]) // run only once on mount or when userId changes

  // Set relative time once on client
  useEffect(() => {
    setTime(timeAgo(new Date(forum.createdAt)))
  }, [forum.createdAt])

  const handleDelete = () => {
    axiosInstance.delete(`/api/v1/forum/delete/${forum.id}`, {
      headers: {
        "Authorization": "Bearer " + sessionStorage.getItem("access_token")
      }
    })
      .then((res) => {
        toast(res.data.message)
        setForumDeleted(forum.id)
      })
      .catch((err: any) => {
        toast(err.response ? err.response.data.message : err.message)
      })
  }
  const handleEdit = () => {
    router.push(`/edit-forum/${forum.id}`)
  }

  const isOwner = sessionStorage.getItem("id") === forum.userId

  return (
    <div className="rounded-lg border bg-card p-5 shadow-sm transition-all hover:shadow-md">

      <div className="flex justify-between ">

        {loadStatus === "loading" ? (
          <div className="flex items-center gap-2 animate-pulse">
            <div className="h-8 w-8 rounded-full bg-gray-300" />
            <div className="flex flex-col gap-1">
              <div className="h-3 w-24 bg-gray-300 rounded" />
              <div className="h-2 w-16 bg-gray-200 rounded" />
            </div>
          </div>
        ) : loadStatus === "failed" ? (
          <div className="text-sm text-red-500">Failed to load user info</div>
        ) : (
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              {/* <AvatarImage src="/placeholder.jpg" alt={user.name || "User"} /> */}
              <AvatarFallback>{user?.name?.substring(0, 2).toLocaleUpperCase() || "?"}</AvatarFallback>
            </Avatar>
            <div className="text-sm">
              <p className="font-medium">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{time}</p>
            </div>
          </div>
        )}

        {isOwner && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                <MoreHorizontal className="h-5 w-5" />
                <span className="sr-only">More</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => {
                // e.stopPropagation()
                handleEdit()
              }}>
                <Edit className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={(e) => {
                  // e.stopPropagation();
                  setIsDeleteDialogOpen(true)
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <Link href={`/forum/${forum.id}`}>
        <h3 className="mt-3 text-xl font-semibold transition-colors hover:text-blue-700">
          {forum.title}
        </h3>
      </Link>

      <p className="mt-2 line-clamp-2 text-muted-foreground">{forum.description}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {forumTags.map((tag) => (
          <Badge key={tag.id} variant="secondary" className="px-2 py-0.5">
            {tag?.name}
          </Badge>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <MessageSquare className="h-4 w-4" />
          <span>{forum.comments?.length}</span>
        </div>
        <div className="flex items-center gap-1">
          <ThumbsUp className="h-4 w-4" />
          <span>{forum.likes?.length}</span>
        </div>
      </div>


      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your forum and all associated comments.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>


    </div>
  )
}
