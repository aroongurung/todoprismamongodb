import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Example data
  const title = "New Todo"
  const isCompleted = false

  // Create a new todo
  const createTodo = await prisma.todo.create({
    data: {
      title,
      isCompleted,
    }
  })
  console.log("Created Todo:", createTodo)

  // Get all todos
  const getAllTodos = await prisma.todo.findMany({
    select: {
      id: true,
      title: true,
      isCompleted: true,
      createdAt: true
    }
  })
  console.log("All Todos:", getAllTodos)

  // Example to delete a Todo by ID
  const todoIdToDelete = getAllTodos[0]?.id // just an example, in real case you'd use actual ID
  const deleteTodo = todoIdToDelete ? await prisma.todo.delete({
    where: { id: todoIdToDelete }
  }) : null
  console.log("Deleted Todo:", deleteTodo)

  // Example to update a Todo by ID
  const todoIdToUpdate = getAllTodos[0]?.id // just an example, in real case you'd use actual ID
  const updateTodo = todoIdToUpdate ? await prisma.todo.update({
    where: { id: todoIdToUpdate },
    data: {
      isCompleted: true // For example, mark as completed
    }
  }) : null
  console.log("Updated Todo:", updateTodo)
}

main()
  .catch(async (e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
