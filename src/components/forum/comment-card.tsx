"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Comment } from "@/lib/data"
import { timeAgo } from "@/lib/utils"
import { useState } from "react"
import axiosInstance from "@/lib/axios-instance"
import { toast } from "sonner"

interface CommentCardProps {
  comment: Comment
  currentUserId: string
  setDeletedComment: (commentId:string) => void
}

export function CommentCard({ comment, currentUserId, setDeletedComment }: CommentCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = () => {
    setIsDeleting(true)
    axiosInstance.delete(`/api/v1/forum/comment/delete/${comment.id}`, {
      headers: {
        "Authorization": "Bearer " + sessionStorage.getItem("access_token")
      }
    })
      .then((res) => {
        toast(res.data.message)
        setDeletedComment(comment.id)
      })
      .catch((err: any) => {
        toast(err.response ? err.response.data.message : err.message)
      })
  }

  const isOwner = comment.user.id === currentUserId

  return (
    <div className="rounded-lg border p-4 shadow-sm">
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            {/* <AvatarImage src={"/user.svg"} alt={comment.user.name} /> */}
            <AvatarFallback>{comment.user.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{comment.user.name}</p>
            <p className="text-xs text-muted-foreground">{timeAgo(new Date(comment.createdAt))}</p>
          </div>
        </div>

        {isOwner && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">More</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>{isDeleting ? "Deleting..." : "Delete"}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <div className="mt-2">
        <p className="text-sm">{comment.content}</p>
      </div>
    </div>
  )
}
