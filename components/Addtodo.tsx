'use client';
import { useState, useEffect } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Plus, SquarePen, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';

interface Todo {
  id: string;
  title: string;
  isCompleted: boolean;
  createdAt: string;
}

export default function Todos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState<string>('');
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Dialog states
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isDeleteConfirmationDialogOpen, setIsDeleteConfirmationDialogOpen] = useState<boolean>(false);

  // Loading state
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/todos');

        if (!response.ok) {
          throw new Error(`Failed to fetch todos. Status: ${response.status}`);
        }

        const data = await response.json();
        setTodos(data);
      } catch (error) {
        console.error('Error fetching todos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodos();
  }, []);

  const addTodo = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, isCompleted }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create todo. Status: ${response.status}`);
      }

      const newTodo: Todo = await response.json();
      setTodos([...todos, newTodo]);
      setTitle('');
      setIsCompleted(false);
    } catch (error) {
      console.error('Error adding todo:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const editTodo = async () => {
    if (editingId === null) return;

    try {
      setIsLoading(true);
      const editResponse = await fetch(`/api/todos/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, isCompleted }),
      });

      if (!editResponse.ok) {
        throw new Error(`Failed to edit todo. Status ${editResponse.status}`);
      }

      const updatedTodo: Todo = await editResponse.json();
      setTodos(todos.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo)));

      setTitle('');
      setIsCompleted(false);
      setEditingId(null);
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error editing todo', error);
    } finally {
      setIsLoading(false);
    }
  };

  const startEditing = (todo: Todo) => {
    setEditingId(todo.id);
    setTitle(todo.title);
    setIsCompleted(todo.isCompleted);
    setIsDialogOpen(true);
  };

  const deleteTodo = async (id: string) => {
    try {
      setIsLoading(true);
      const deleteResponse = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!deleteResponse.ok) {
        throw new Error(`Failed to delete todo, Status ${deleteResponse.status}`);
      }

      setTodos(todos.filter((todo) => todo.id !== id));
      setIsDeleteConfirmationDialogOpen(false); // Close the confirmation dialog after successful delete
    } catch (error) {
      console.error('Error deleting todo', error);
    } finally {
      setIsLoading(false);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTitle('');
    setIsCompleted(false);
    setIsDialogOpen(false);
  };

  const handleDeleteClick = (id: string) => {
    // Open confirmation dialog when delete is clicked
    setEditingId(id); // Temporarily set the editingId to the todo's ID for context
    setIsDeleteConfirmationDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (editingId) {
      deleteTodo(editingId);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteConfirmationDialogOpen(false);
  };

  return (
    <section className="mt-8">
      <div className="flex flex-col justify-center items-center container max-w-4xl mx-auto">
        <h1 className="font-bold text-4xl mb-8 sm:text-5xl md:text-6xl lg:text-8xl">Increase your Productivity</h1>
        <h2 className="font-semibold italic text-2xl sm:text-4xl md:5xl lg:text-6xl">Use Todo<span className="text-teal-700">App</span></h2>

        {isLoading && (
          <div className="flex justify-center items-center mt-4">
            <Spinner />
            <p className="ml-2 text-lg font-semibold">Loading...</p>
          </div>
        )}

        {!isLoading && (
          <div className="mt-12 flex justify-center items-center w-full px-6">
            <Input
              type="text"
              placeholder="Enter todo title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-4/6"
            />
            <Button onClick={editingId ? editTodo : addTodo} className="ml-2">
              {editingId ? 'Edit Todo' : 'Add Todo'} <Plus />
            </Button>
          </div>
        )}

        <div className="border border-zinc-200 w-5/6 h-auto rounded-md my-8">
          <ul className="p-2 text-start">
            {todos.map((todo) => (
              <li key={todo.id} className="text-teal-700 font-medium flex flex-col border-b border-zinc-300 py-4 sm:flex-row space-y-4 sm:space-y-0 justify-between items-center">
                <span>{todo.title} <span className="text-zinc-950 border border-zinc-200 px-2 rounded-sm">{todo.isCompleted ? 'Completed' : 'In Progress'}</span></span>
                <div className="flex space-x-2">
                  <Button onClick={() => startEditing(todo)}>Edit <SquarePen /></Button>
                  <Button onClick={() => handleDeleteClick(todo.id)}>Delete <Trash2 /></Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Edit Todo Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Todo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Edit your todo"
              className="w-full"
            />
            <DialogFooter>
              <Button onClick={editTodo} disabled={isLoading}>
                {isLoading ? <Spinner /> : 'Save'}
              </Button>
              <Button onClick={cancelEdit} variant="outline">Cancel</Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteConfirmationDialogOpen} onOpenChange={setIsDeleteConfirmationDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Are you sure you want to delete this todo? This action cannot be undone.</p>
            <DialogFooter>
              <Button onClick={handleConfirmDelete} variant="destructive">
                Yes, Delete
              </Button>
              <Button onClick={handleCancelDelete} variant="outline">
                Cancel
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
