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

    // Create a new todo entry in the database
    const newTodo = await prisma.todo.create({
      data: {
        title,
        isCompleted,
      },
    })

    return new Response(JSON.stringify(newTodo), { status: 201 })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error creating todo' }), { status: 500 })
  }
}
