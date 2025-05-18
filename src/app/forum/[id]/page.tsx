"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getForum, getForumComments, getCurrentUser } from "@/lib/data"
import type { Forum, Comment, User, Tag } from "@/lib/data"
import Navbar from "@/components/navbar"
// import { CommentCard } from "@/components/comment-card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ArrowLeft, Edit, MoreHorizontal, ThumbsUp, Trash2 } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { CommentCard } from "@/components/forum/comment-card"
import DashboardLayout from "@/app/dashboard-layout"
import axiosInstance from "@/lib/axios-instance"
import { toast } from "sonner"

export default function ForumPage({ params }: { params: { id: string } }) {
    const { id } = params
    const [forum, setForum] = useState<Forum | null>(null)
    const [comments, setComments] = useState<Comment[]>([])
    const [currentUser, setCurrentUser] = useState<User | null>(null)
    const [newComment, setNewComment] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isLiked, setIsLiked] = useState(false)
    const [likeCount, setLikeCount] = useState(0)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [forumTags, setForumTags] = useState<Tag[]>([])

    const router = useRouter()

    useEffect(() => {
        axiosInstance.get(`/api/v1/forum/get/${id}?detailed=true`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("access_token")}`
            }
        })
            .then((res) => {
                const resData = res.data
                if (resData) {
                    setForum(resData.data)
                    setLikeCount(resData.data.likes.length)
                    setComments(resData.data.comments)
                    setCurrentUser(resData.data.user)
                    setForumTags(JSON.parse(resData.data.tags))
                }
                else {
                    router.push("/home")
                }
            })
            .catch((err: any) => {
                console.log(err);
                toast(err.response ? err.response.data.message : err.message)

            })
            .finally(() => {
                setIsLoading(false)
            })
    }, [id])

    const handleSubmitComment = () => {
        if (!newComment.trim() || !currentUser) return

        setIsSubmitting(true)
        axiosInstance.post(`/api/v1/forum/comment/${id}`,
            { content: newComment },
            {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
                    "Content-Type": "application/json"
                }
            })
            .then((res) => {
                const resData = res.data.comment
                const newCommentObj: Comment = {
                    id: resData.id,
                    content: newComment,
                    createdAt: new Date(),
                    userId: currentUser.id,
                    user: currentUser,
                    forumId: id,
                }

                setComments((prev) => [newCommentObj, ...prev])
                setNewComment("")
                setIsSubmitting(false)
                // setComments((prev) => [resData.comment, ...prev])
                // setNewComment("")
                // setIsSubmitting(false)
            })
            .catch((err: any) => {
                toast(err.response ? err.response.data.message : err.message)
                setIsSubmitting(false)
            })

        // Simulate API call
        // setTimeout(() => {
        //     const newCommentObj: Comment = {
        //         id: `temp-${Date.now()}`,
        //         content: newComment,
        //         createdAt: new Date(),
        //         userId: currentUser.id,
        //         user: currentUser,
        //         forumId: id,
        //     }

        //     setComments((prev) => [newCommentObj, ...prev])
        //     setNewComment("")
        //     setIsSubmitting(false)
        // }, 500)
    }

    const handleLike = () => {
        // setIsLiked(!isLiked)
        // setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1))
        axiosInstance.post("/api/v1/forum/like/" + id, {}, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("access_token")}`
            }
        })
            .then((res) => {
                const data = res.data
                data.message === "Liked" && setLikeCount((prev) => prev + 1)
                data.message === "Unliked" && setLikeCount((prev) => prev - 1)
            })
            .catch((err) => {
                toast(err.response ? err.response.data.message : err.message)
            })
    }

    const handleDelete = () => {
        axiosInstance.delete(`/api/v1/forum/delete/${id}`, {
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem("access_token")
            }
        })
            .then((res) => {
                toast(res.data.message)
                router.push("/home")
            })
            .catch((err: any) => {
                toast(err.response ? err.response.data.message : err.message)
            })
    }

    const handleEdit = () => {
        router.push(`/edit-forum/${id}`)
    }
    const isOwner = sessionStorage.getItem("id") === forum?.userId

    return (
        <DashboardLayout>
            {
                isLoading ?
                    <div className="container py-8">
                        <div className="animate-pulse space-y-4">
                            <div className="h-8 w-48 rounded bg-muted"></div>
                            <div className="h-6 w-full rounded bg-muted"></div>
                            <div className="h-24 w-full rounded bg-muted"></div>
                        </div>
                    </div>
                    :
                    !forum ?
                        <div className="container py-8 text-center">
                            <h1 className="text-2xl font-bold">Forum not found</h1>
                            <Button variant="outline" className="mt-4" onClick={() => router.push("/home")}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Home
                            </Button>
                        </div>
                        :
                        <>
                            <div className="container py-8">
                                <Button variant="outline" className="mb-6" onClick={() => router.push("/home")}>
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back to Forums
                                </Button>

                                <div className="rounded-lg border bg-card p-6 shadow">
                                    <div className="flex justify-between">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10">
                                                {/* <AvatarImage src={forum.user.image || "/placeholder.svg"} alt={forum.user.name} /> */}
                                                <AvatarFallback>{forum.user.name.substring(0, 2).toLocaleUpperCase()}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">{forum.user.name}</p>
                                                <p className="text-sm text-muted-foreground">{formatDate(forum.createdAt)}</p>
                                            </div>
                                        </div>

                                        {isOwner && (
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="h-5 w-5" />
                                                        <span className="sr-only">More</span>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={handleEdit}>
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        <span>Edit</span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="text-destructive focus:text-destructive"
                                                        onClick={() => setIsDeleteDialogOpen(true)}
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        <span>Delete</span>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        )}
                                    </div>

                                    <h1 className="mt-4 text-2xl font-bold">{forum.title}</h1>

                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {forumTags.map((tag) => (
                                            <Badge key={tag.id} variant="secondary">
                                                {tag.name}
                                            </Badge>
                                        ))}
                                    </div>

                                    <p className="mt-4 whitespace-pre-line">{forum.description}</p>

                                    <div className="mt-6 flex items-center gap-4">
                                        <Button variant={isLiked ? "default" : "outline"} size="sm" className="gap-2" onClick={handleLike}>
                                            <ThumbsUp className="h-4 w-4" />
                                            <span>{likeCount}</span>
                                        </Button>
                                    </div>
                                </div>

                                <div className="mt-8">
                                    <h2 className="mb-4 text-xl font-semibold">Comments ({comments.length})</h2>

                                    {currentUser && (
                                        <div className="mb-6 rounded-lg border bg-card p-4 shadow-sm">
                                            <div className="flex items-center gap-3 mb-3">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={currentUser.image || "/placeholder.svg"} alt={currentUser.name} />
                                                    <AvatarFallback>{currentUser.name.substring(0, 2)}</AvatarFallback>
                                                </Avatar>
                                                <p className="font-medium">{currentUser.name}</p>
                                            </div>

                                            <Textarea
                                                placeholder="Write a comment..."
                                                value={newComment}
                                                onChange={(e) => setNewComment(e.target.value)}
                                                className="mb-3"
                                            />

                                            <div className="flex justify-end">
                                                <Button
                                                    onClick={handleSubmitComment}
                                                    disabled={!newComment.trim() || isSubmitting}
                                                    className="gradient-button"
                                                >
                                                    {isSubmitting ? "Posting..." : "Post Comment"}
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-4">
                                        {comments.length > 0 ? (
                                            comments.map((comment) => (
                                                <CommentCard key={comment.id} comment={comment} currentUserId={currentUser?.id || ""} setDeletedComment={(cid) => setComments(comments.filter((c: Comment) => c.id !== cid))} />
                                            ))
                                        ) : (
                                            <p className="text-center py-8 text-muted-foreground">No comments yet. Be the first to comment!</p>
                                        )}
                                    </div>
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

                            <footer className="border-t py-6 text-center text-sm text-muted-foreground">
                                © 2025 User Forum. All rights reserved.
                            </footer>

                        </>

            }

        </DashboardLayout>

    )
}
