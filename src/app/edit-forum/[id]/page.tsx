"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { Forum, User, Tag } from "@/lib/data"
import { tags as allTags } from "@/lib/data"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, X } from "lucide-react"
import DashboardLayout from "@/app/dashboard-layout"
import axiosInstance from "@/lib/axios-instance"

export default function EditForumPage({ params }: { params: { id: string } }) {
  const router = useRouter()

  // const [forum, setForum] = useState<Forum | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [selectedTags, setSelectedTags] = useState<Tag[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // 🔐 Fetch forum once
  useEffect(() => {
    const fetchForum = async () => {
      try {
        const res = await axiosInstance.get(`/api/v1/forum/get/${params.id}`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
          },
        })

        const forumData = res.data?.data
        if (!forumData) {
          return router.push("/home")
        }

        // setForum(forumData)
        setTitle(forumData.title)
        setDescription(forumData.description)
        setSelectedTags(JSON.parse(forumData.tags))
      } catch (error) {
        console.error("Error fetching forum:", error)
        router.push("/home")
      } finally {
        setIsLoading(false)
      }
    }

    fetchForum()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !description.trim()) return

    setIsSubmitting(true)

    try {
      const res = await axiosInstance.put(
        `/api/v1/forum/edit/${params.id}`,
        {
          title: title.trim(),
          description: description.trim(),
          tags: JSON.stringify(selectedTags),
        },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
          },
        }
      )

      if (res.status === 200) {
        router.push(`/forum/${params.id}`)
      } else {
        console.error("Failed to update forum")
      }
    } catch (error) {
      console.error("Edit forum error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

const toggleTag = (tag: Tag) => {
  setSelectedTags((prev) => {
    const exists = prev.find((t) => String(t.id) === String(tag.id))
    if (exists) {
      return prev.filter((t) => String(t.id) !== String(tag.id))
    } else {
      return [...prev, tag]
    }
  })
}


  const availableTags = allTags.filter(
    (tag) => !selectedTags.some((t) => t.id === tag.id)
  )

  return (
    <DashboardLayout>
      {isLoading ? (
        <div className="container py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 rounded bg-muted" />
            <div className="h-6 w-full rounded bg-muted" />
            <div className="h-24 w-full rounded bg-muted" />
          </div>
        </div>
      ) : (
        <div className="container py-8">
          <Button
            variant="outline"
            className="mb-6"
            onClick={() => router.push(`/forum/${params.id}`)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Forum
          </Button>

          <div className="mx-auto max-w-2xl rounded-lg border bg-card p-6 shadow">
            <h1 className="text-2xl font-bold">Edit Forum</h1>
            <p className="mt-2 text-muted-foreground">Update your forum details</p>

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
                    <Badge key={tag.id} className="flex items-center gap-1 px-3 py-1 justify-between  cursor-pointer" onClick={() => toggleTag(tag)}>
                      {tag.name}
                      <X className="h-3 w-3" />
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

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={!title.trim() || !description.trim() || isSubmitting}
                  className="gradient-button"
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        © 2025 User Forum. All rights reserved.
      </footer>
    </DashboardLayout>
  )
}
