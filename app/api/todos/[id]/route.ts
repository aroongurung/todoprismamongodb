import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET: Fetch all todos
export async function GET() {
  try {
    const todos = await prisma.todo.findMany({
      select: {
        id: true,
        title: true,
        isCompleted: true,
        createdAt: true,
      }
    })
    return new Response(JSON.stringify(todos), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error fetching todos' }), { status: 500 })
  }
}

// POST: Create a new todo
export async function POST(request: Request) {
  try {
    const { title, isCompleted } = await request.json()

    const newTodo = await prisma.todo.create({
      data: {
        title,
        isCompleted
      }
    })
    return new Response(JSON.stringify(newTodo), { status: 201 })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error creating todo' }), { status: 500 })
  }
}

// PUT: Update a todo by ID
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { title, isCompleted } = await request.json()
    const { id } = await params // Extract `id` from the URL and await params

    // Update the todo in the database
    const updatedTodo = await prisma.todo.update({
      where: { id },
      data: {
        title,
        isCompleted
      }
    })

    return new Response(JSON.stringify(updatedTodo), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error updating todo' }), { status: 500 })
  }
}

// DELETE: Delete a todo by ID
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = await params // Get the `id` from the URL
    const deletedTodo = await prisma.todo.delete({
      where: { id }
    })
    return new Response(JSON.stringify(deletedTodo), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error deleting todo' }), { status: 500 })
  }
}