import axiosInstance from "./axios-instance"

export type User = {
  id: string
  name: string
  email: string
  image?: string
}

export type Tag = {
  id: string
  name: string
}

export type Forum = {
  id: string
  title: string
  description: string
  tags: string
  createdAt: Date
  userId: string
  user: User
  comments: Comment[]
  likes: Like[]
}

export type Comment = {
  id: string
  content: string
  createdAt: Date
  userId: string
  user: User
  forumId: string
}

// Dummy users
export const users: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "3",
    name: "Alex Johnson",
    email: "alex@example.com",
    image: "/placeholder.svg?height=40&width=40",
  },
]

// Dummy tags
export const tags: Tag[] = [
  { id: "1", name: "Technology" },
  { id: "2", name: "Programming" },
  { id: "3", name: "Design" },
  { id: "4", name: "Business" },
  { id: "5", name: "Health" },
  { id: "6", name: "Science" },
  { id: "7", name: "Gaming" },
  { id: "8", name: "Education" },
]

// Dummy forums
export const forums: Forum[] = [
  {
    id: "1",
    title: "Getting Started with Next.js",
    description:
      "I'm new to Next.js and would like some tips on how to get started with building a full-stack application. What are some good resources and best practices?",
    tags: [tags[0], tags[1]],
    createdAt: new Date("2023-05-15"),
    userId: "1",
    user: users[0],
    commentCount: 8,
    likeCount: 24,
  },
  {
    id: "2",
    title: "UI Design Principles for Web Applications",
    description:
      "Let's discuss the key UI design principles that make web applications more user-friendly and aesthetically pleasing. What are your thoughts on minimalism vs. rich interfaces?",
    tags: [tags[2], tags[0]],
    createdAt: new Date("2023-05-20"),
    userId: "2",
    user: users[1],
    commentCount: 12,
    likeCount: 35,
  },
  {
    id: "3",
    title: "Database Selection for High-Traffic Applications",
    description:
      "I'm building an application that expects high traffic. Should I go with PostgreSQL, MySQL, or something else? What are the performance considerations?",
    tags: [tags[0], tags[1]],
    createdAt: new Date("2023-06-01"),
    userId: "3",
    user: users[2],
    commentCount: 15,
    likeCount: 42,
  },
  {
    id: "4",
    title: "The Future of AI in Software Development",
    description:
      "How do you think AI will change software development in the next 5 years? Will it replace certain roles or enhance productivity?",
    tags: [tags[0], tags[5]],
    createdAt: new Date("2023-06-10"),
    userId: "1",
    user: users[0],
    commentCount: 20,
    likeCount: 56,
  },
  {
    id: "5",
    title: "Best Practices for API Design",
    description:
      "What are some best practices for designing RESTful APIs that are both developer-friendly and performant?",
    tags: [tags[0], tags[1]],
    createdAt: new Date("2023-06-15"),
    userId: "2",
    user: users[1],
    commentCount: 7,
    likeCount: 18,
  },
  {
    id: "6",
    title: "Gaming Industry Trends in 2023",
    description:
      "What are the biggest trends in the gaming industry this year? How are indie developers competing with large studios?",
    tags: [tags[6]],
    createdAt: new Date("2023-06-20"),
    userId: "3",
    user: users[2],
    commentCount: 9,
    likeCount: 27,
  },
]

// Dummy comments
export const comments: Comment[] = [
  {
    id: "1",
    content:
      "I recommend checking out the official Next.js documentation. It's very comprehensive and has great examples.",
    createdAt: new Date("2023-05-16T10:30:00"),
    userId: "2",
    user: users[1],
    forumId: "1",
  },
  {
    id: "2",
    content: "Also, there are some great YouTube tutorials by Vercel that walk you through building full applications.",
    createdAt: new Date("2023-05-16T11:45:00"),
    userId: "3",
    user: users[2],
    forumId: "1",
  },
  {
    id: "3",
    content:
      "I've found that minimalism works better for most web applications. It reduces cognitive load and makes the UI more intuitive.",
    createdAt: new Date("2023-05-21T09:15:00"),
    userId: "1",
    user: users[0],
    forumId: "2",
  },
  {
    id: "4",
    content:
      "I disagree. Rich interfaces can provide more functionality and visual cues that help users understand complex systems.",
    createdAt: new Date("2023-05-21T10:20:00"),
    userId: "3",
    user: users[2],
    forumId: "2",
  },
  {
    id: "5",
    content:
      "For high-traffic applications, PostgreSQL has better performance for complex queries and scales well with proper configuration.",
    createdAt: new Date("2023-06-02T14:10:00"),
    userId: "1",
    user: users[0],
    forumId: "3",
  },
  {
    id: "6",
    content: "Don't forget to consider the operational aspects. MySQL might be easier to manage for some teams.",
    createdAt: new Date("2023-06-02T15:30:00"),
    userId: "2",
    user: users[1],
    forumId: "3",
  },
  {
    id: "7",
    content:
      "I think AI will enhance productivity rather than replace developers. It will handle more routine tasks, allowing developers to focus on creative problem-solving.",
    createdAt: new Date("2023-06-11T08:45:00"),
    userId: "2",
    user: users[1],
    forumId: "4",
  },
  {
    id: "8",
    content:
      "We're already seeing AI-assisted coding with tools like GitHub Copilot. I expect this trend to accelerate.",
    createdAt: new Date("2023-06-11T09:30:00"),
    userId: "3",
    user: users[2],
    forumId: "4",
  },
]

// Helper functions to simulate API calls
export function getForums() {
  return axiosInstance.get("/api/v1/forum/get-all", {
    headers: {
      "Authorization" : `Bearer ${sessionStorage.getItem("access_token")}`
    }
  })
}

export function getForum(id: string) {
  const forum = forums.find((f) => f.id === id)
  return Promise.resolve(forum)
}

export function getForumComments(forumId: string) {
  const forumComments = comments.filter((c) => c.forumId === forumId)
  return Promise.resolve(forumComments)
}

export function getCurrentUser() {
  // Simulate current logged in user
  return Promise.resolve(users[0])
}
