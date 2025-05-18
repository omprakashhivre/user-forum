"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { User, Forum, Comment } from "@/lib/data"
import Navbar from "@/components/navbar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { ForumCard } from "@/components/forum/forum-card"
import { CommentCard } from "@/components/forum/comment-card"
import DashboardLayout from "../dashboard-layout"
import axiosInstance from "@/lib/axios-instance"

export default function ProfilePage() {
    const [currentUser, setCurrentUser] = useState<User | null>(null)
    const [userForums, setUserForums] = useState<Forum[]>([])
    const [userComments, setUserComments] = useState<Comment[]>([])
    const [userLikes, setUserLikes] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const loadUserData = async () => {
            setIsLoading(true)
            try {
                const res = await axiosInstance.get("/api/v1/user/me", {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem("access_token")}`
                    }
                })

                const resData = res.data

                if (resData.status !== "success") throw new Error(resData.message)

                const userData = resData.data

                setCurrentUser({
                    id: userData.id,
                    name: userData.name,
                    email: userData.email,
                    image: userData.image || null,
                })

                setUserForums(userData.createdForums || [])
                setUserComments(userData.comments || [])
                setUserLikes(userData.likedForums || [])

            } catch (err) {
                console.error("Error fetching user profile:", err)
                sessionStorage.clear()
                router.push("/")
            } finally {
                setIsLoading(false)
            }
        }

        loadUserData()
    }, [router])

    const handleDeleteLike = async (likeId: string) => {
        try {
            await axiosInstance.delete(`/api/v1/likes/${likeId}`, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("access_token")}`
                }
            })
            setUserLikes(prev => prev.filter(l => l.id !== likeId))
        } catch (err) {
            console.error("Failed to delete like:", err)
        }
    }

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="container py-8">
                    <div className="animate-pulse space-y-4">
                        <div className="h-20 w-full rounded bg-muted"></div>
                        <div className="h-8 w-48 rounded bg-muted"></div>
                        <div className="h-64 w-full rounded bg-muted"></div>
                    </div>
                </div>
            </DashboardLayout>
        )
    }

    if (!currentUser) {
        return (
            <DashboardLayout>
                <div className="container py-8 text-center">
                    <h1 className="text-2xl font-bold">User not found</h1>
                    <Button variant="outline" className="mt-4" onClick={() => router.push("/home")}>Back to Home</Button>
                </div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout>
            <div className="py-8 w-full">
                <Button variant="outline" className="mb-6" onClick={() => router.push("/")}>Back to Forums</Button>

                <div className="rounded-lg border bg-card p-6 shadow">
                    <div className="flex flex-col items-center sm:flex-row sm:items-start sm:gap-6">
                        <Avatar className="h-24 w-24">
                            <AvatarImage src={currentUser.image || "/placeholder.svg"} alt={currentUser.name} />
                            <AvatarFallback className="text-2xl">{currentUser.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="mt-4 text-center sm:mt-0 sm:text-left">
                            <h1 className="text-2xl font-bold">{currentUser.name}</h1>
                            <p className="text-muted-foreground">{currentUser.email}</p>
                            <div className="mt-4 flex flex-wrap gap-4 justify-center sm:justify-start">
                                <div><p className="text-2xl font-bold">{userForums.length}</p><p className="text-sm text-muted-foreground">Forums</p></div>
                                <div><p className="text-2xl font-bold">{userComments.length}</p><p className="text-sm text-muted-foreground">Comments</p></div>
                                <div><p className="text-2xl font-bold">{userLikes.length}</p><p className="text-sm text-muted-foreground">Likes</p></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8">
                    <Tabs defaultValue="forums">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="forums">My Forums</TabsTrigger>
                            <TabsTrigger value="comments">My Comments</TabsTrigger>
                            {/* <TabsTrigger value="likes">My Likes</TabsTrigger> */}
                        </TabsList>

                        <TabsContent value="forums" className="mt-6">
                            {userForums.length > 0 ? (
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {userForums.map((forum, i) => (
                                        <ForumCard key={i} forum={forum} setForumDeleted={(id) => setUserForums(userForums.filter(f => f.id !== id))} />
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <p className="text-xl font-medium">No forums yet</p>
                                    <p className="text-muted-foreground">Create your first forum to get started</p>
                                    <Button className="mt-4 gradient-button" onClick={() => router.push("/create-forum")}>Create Forum</Button>
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="comments" className="mt-6">
                            {userComments.length > 0 ? (
                                <div className="space-y-4">
                                    {userComments.map((comment, i) => (
                                        <CommentCard key={i} comment={comment} currentUserId={currentUser.id} setDeletedComment={(id) => setUserComments(userComments.filter(c => c.id !== id))} />
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <p className="text-xl font-medium">No comments yet</p>
                                    <p className="text-muted-foreground">Join the conversation by commenting on forums</p>
                                    <Button className="mt-4 gradient-button" onClick={() => router.push("/")}>Browse Forums</Button>
                                </div>
                            )}
                        </TabsContent>

                        {/* <TabsContent value="likes" className="mt-6">
                            {userLikes.length > 0 ? (
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {userLikes.map((like, i) => (
                                        <div key={i} className="relative border p-4 rounded shadow">
                                            <ForumCard forum={like.forum} />
                                            <Button size="sm" variant="destructive" className="absolute top-2 right-2" onClick={() => handleDeleteLike(like.id)}>Remove Like</Button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <p className="text-xl font-medium">No liked forums yet</p>
                                    <p className="text-muted-foreground">Like a forum to see it here</p>
                                    <Button className="mt-4 gradient-button" onClick={() => router.push("/")}>Browse Forums</Button>
                                </div>
                            )}
                        </TabsContent> */}
                    </Tabs>
                </div>
            </div>
            <footer className="border-t py-6 text-center text-sm text-muted-foreground">
                © 2025 User Forum. All rights reserved.
            </footer>
        </DashboardLayout>
    )
}