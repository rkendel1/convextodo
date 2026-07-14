import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

export const listTasks = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('tasks').order('desc').collect()
  },
})

export const createTask = mutation({
  args: {
    title: v.string(),
    assignee: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now()
    return await ctx.db.insert('tasks', {
      title: args.title.trim(),
      completed: false,
      assignee: args.assignee?.trim() || undefined,
      createdAt: now,
      updatedAt: now,
    })
  },
})

export const updateTask = mutation({
  args: {
    id: v.id('tasks'),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      title: args.title.trim(),
      updatedAt: Date.now(),
    })
  },
})

export const closeTask = mutation({
  args: {
    id: v.id('tasks'),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      completed: true,
      updatedAt: Date.now(),
    })
  },
})

export const deleteTask = mutation({
  args: {
    id: v.id('tasks'),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id)
  },
})

export const assignTask = mutation({
  args: {
    id: v.id('tasks'),
    assignee: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      assignee: args.assignee.trim(),
      updatedAt: Date.now(),
    })
  },
})
