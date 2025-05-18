"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser, tags as allTags } from "@/lib/data"
import type { User, Tag } from "@/lib/data"
import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, X } from "lucide-react"
import axiosInstance from "@/lib/axios-instance"
import { toast } from "sonner"
import DashboardLayout from "../dashboard-layout"

export default function CreateForumPage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [selectedTags, setSelectedTags] = useState<Tag[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [forum, setForum] = useState<any>(null)

  const router = useRouter()

  // useEffect(() => {
  //   const loadUser = async () => {
  //     try {
  //       const user = await getCurrentUser()
  //       setCurrentUser(user)
  //     } catch (error) {
  //       console.error("Failed to load user:", error)
  //       router.push("/auth/login")
  //     }
  //   }

  //   loadUser()
  // }, [router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !description.trim()) return

    setIsSubmitting(true)

    axiosInstance.post("/api/v1/forum/create", {
      title,
      description,
      tags: JSON.stringify(selectedTags)
    }, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${sessionStorage.getItem("access_token")}`
      }
    })
    .then((res) => {
      const respData = res.data
      if(respData.status === "success") {
        toast(respData.message || "Forum created successfully..")
        setTitle("")
        setDescription("")
        setSelectedTags([])
        setForum(respData.forum)
      }
      else{
        toast(respData.message || "Unable to create forum right now, try again later...")
      }
    })
    .catch((err:any) => {
      const errMsg = err.response ? err.response.data.message : err.message
      toast(errMsg)
    })
    .finally(() => {
      setIsSubmitting(false)
    })

  }

  const toggleTag = (tag: Tag) => {
    setSelectedTags((prev) =>
      prev.some((t) => t.id === tag.id) ? prev.filter((t) => t.id !== tag.id) : [...prev, tag],
    )
  }

  const availableTags = allTags.filter((tag) => !selectedTags.some((t) => t.id === tag.id))

  return (
    // <main className="min-h-screen bg-background">
    //   <Navbar />
    <DashboardLayout>
      <div className="container py-8">
        <Button variant="outline" className="mb-6" onClick={() => router.push("/home")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Forums
        </Button>

        <div className="mx-auto max-w-2xl rounded-lg border bg-card p-6 shadow">
          <h1 className="text-2xl font-bold">Create a New Forum</h1>
          <p className="mt-2 text-muted-foreground">Share your thoughts, questions, or ideas with the community</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title <span className="text-destructive">*</span>
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a descriptive title"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description <span className="text-destructive">*</span>
              </label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide details about your topic"
                rows={6}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tags (optional)</label>
              <div className="flex flex-wrap gap-2">
                {selectedTags.map((tag) => (
                  <Badge key={tag.id} className="flex items-center gap-1 px-3 py-1 cursor-pointer" onClick={() => toggleTag(tag)}>
                    {tag.name}
                    <X className="h-3 w-3"  />
                  </Badge>
                ))}
              </div>

              <div className="mt-2 flex flex-wrap gap-2">
                {availableTags.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant="outline"
                    className="cursor-pointer px-3 py-1"
                    onClick={() => toggleTag(tag)}
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              {forum && <Button
                type="button"
                className="gradient-button"
                onClick={() => router.push(`/forum/${forum.id}`)}
              >
                View Forum
              </Button>}
              <Button
                type="submit"
                disabled={!title.trim() || !description.trim() || isSubmitting}
                className="gradient-button"
              >
                {isSubmitting ? "Creating..." : "Create Forum"}
              </Button>
            </div>
          </form>
        </div>
      </div>

      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        © 2025 User Forum. All rights reserved.
      </footer>

    </DashboardLayout>

    // </main>
  )
}
