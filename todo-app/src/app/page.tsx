'use client';

import { useState, useEffect } from 'react';
import { Plus, Check, Trash2, Circle, CheckCircle2, ListTodo, ClipboardList } from 'lucide-react';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

type FilterType = 'all' | 'active' | 'completed';

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('todos');
    if (saved) {
      const parsed = JSON.parse(saved);
      setTodos(parsed.map((t: Todo) => ({ ...t, createdAt: new Date(t.createdAt) })));
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('todos', JSON.stringify(todos));
    }
  }, [todos, isLoaded]);

  const addTodo = () => {
    if (inputValue.trim() === '') return;
    
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: inputValue.trim(),
      completed: false,
      createdAt: new Date(),
    };
    
    setTodos([newTodo, ...todos]);
    setInputValue('');
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const activeCount = todos.filter(t => !t.completed).length;
  const completedCount = todos.filter(t => t.completed).length;

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="animate-pulse text-slate-400">載入中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-2">
            <ListTodo className="w-10 h-10 text-blue-500" />
            <h1 className="text-4xl font-bold text-slate-800">Todo List</h1>
          </div>
          <p className="text-slate-500">簡單高效地管理你的任務</p>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 mb-6">
          <div className="flex gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="新增任務..."
              className="flex-1 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         text-slate-700 placeholder:text-slate-400 transition-all"
            />
            <button
              onClick={addTodo}
              disabled={inputValue.trim() === ''}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-300
                         text-white rounded-xl font-medium transition-all
                         flex items-center gap-2 shadow-sm hover:shadow-md disabled:shadow-none"
            >
              <Plus className="w-5 h-5" />
              新增
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-4">
          {(['all', 'active', 'completed'] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === f
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              {f === 'all' && `全部 (${todos.length})`}
              {f === 'active' && `進行中 (${activeCount})`}
              {f === 'completed' && `已完成 (${completedCount})`}
            </button>
          ))}
        </div>

        {/* Todo List */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {filteredTodos.length === 0 ? (
            <div className="py-16 text-center">
              <ClipboardList className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-400 text-lg">
                {filter === 'all' && '尚無任務，開始新增吧！'}
                {filter === 'active' && '沒有進行中的任務'}
                {filter === 'completed' && '尚未完成任何任務'}
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {filteredTodos.map((todo) => (
                <li
                  key={todo.id}
                  className="group flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors"
                >
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className="flex-shrink-0 transition-transform hover:scale-110"
                  >
                    {todo.completed ? (
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                    ) : (
                      <Circle className="w-6 h-6 text-slate-300 hover:text-blue-400" />
                    )}
                  </button>
                  
                  <span
                    className={`flex-1 text-lg transition-all ${
                      todo.completed
                        ? 'text-slate-400 line-through'
                        : 'text-slate-700'
                    }`}
                  >
                    {todo.text}
                  </span>
                  
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="flex-shrink-0 p-2 rounded-lg text-slate-400 
                               opacity-0 group-hover:opacity-100
                               hover:bg-red-50 hover:text-red-500 transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer Stats */}
        {todos.length > 0 && (
          <div className="flex items-center justify-between mt-4 px-2 text-sm text-slate-500">
            <span>{activeCount} 個任務待完成</span>
            {completedCount > 0 && (
              <button
                onClick={clearCompleted}
                className="hover:text-red-500 transition-colors"
              >
                清除已完成
              </button>
            )}
          </div>
        )}

        {/* Credit */}
        <p className="text-center text-slate-400 text-sm mt-8">
          Made with ❤️ by 廖小雄
        </p>
      </div>
    </div>
  );
}
