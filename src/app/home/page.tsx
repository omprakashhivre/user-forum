"use client"

import { useState, useEffect } from "react"
import { getForums } from "@/lib/data"
import type { Forum } from "@/lib/data"
import { ForumCard } from "@/components/forum/forum-card"
import Navbar from "@/components/navbar"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, X } from "lucide-react"
import DashboardLayout from "../dashboard-layout"

export default function Home() {
  const [forums, setForums] = useState<Forum[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deletedForumId, setDeletedForumId] = useState<string>("")

  useEffect(() => {
    const loadForums = async () => {
      try {
        const data = await getForums()
        setForums(data.data.data)
      } catch (error) {
        console.error("Failed to load forums:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadForums()
  }, [deletedForumId])

  // Get all unique tags from forums
  const allTags = forums.reduce((tags, forum) => {
    let parsedTags: { id: string; name: string }[] = [];

    try {
      parsedTags = JSON.parse(forum.tags);
    } catch (error) {
      console.warn("Invalid tags format in forum:", forum);
      parsedTags = [];
    }

    parsedTags.forEach((tag) => {
      if (!tags.some((t) => t.id === tag.id)) {
        tags.push(tag);
      }
    });

    return tags;
  }, [] as { id: string; name: string }[]);

  const filteredForums = forums.filter((forum) => {
    const matchesSearch =
      searchTerm === "" ||
      forum.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      forum.description.toLowerCase().includes(searchTerm.toLowerCase());

    let parsedTags: { id: string; name: string }[] = [];

    try {
      parsedTags = JSON.parse(forum.tags);
    } catch (error) {
      parsedTags = [];
    }

    const matchesTags =
      selectedTags.length === 0 ||
      parsedTags.some((tag) => selectedTags.includes(tag.id));

    return matchesSearch && matchesTags;
  });


  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) => (prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]))
  }

  return (
    // <main className="min-h-screen bg-background w-100dvw">
    //   <Navbar />
    <DashboardLayout>
      <div className="w-full px-2 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold">User Forum</h1>
          <p className="mt-2 text-muted-foreground">Create forums, and interact through comments/questions</p>
        </div>

        <div className="mb-8 w-full">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search forums..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <Badge
                key={tag.id}
                variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleTag(tag.id)}
              >
                {tag.name}
                {selectedTags.includes(tag.id) && (
                  <X
                    className="ml-1 h-3 w-3"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleTag(tag.id)
                    }}
                  />
                )}
              </Badge>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 rounded-lg border bg-card p-5 shadow-sm animate-pulse" />
            ))}
          </div>
        ) : filteredForums.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredForums.map((f) => (
              <ForumCard key={f.id} forum={f} setForumDeleted={setDeletedForumId}/>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-xl font-medium">No forums found</p>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        © 2025 User Forum. All rights reserved.
      </footer>

    </DashboardLayout>
    // </main>
  )
}
