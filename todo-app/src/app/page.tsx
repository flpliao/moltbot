'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Circle, CheckCircle2, ListTodo, ClipboardList } from 'lucide-react';

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
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 flex items-center justify-center">
        <div className="animate-pulse text-slate-500">載入中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 py-8 px-4">
      {/* Decorative blurred circles */}
      <div className="fixed top-20 left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
      <div className="fixed top-40 right-20 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
      <div className="fixed bottom-20 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-2">
            <div className="p-3 bg-white/30 backdrop-blur-md rounded-2xl border border-white/40 shadow-lg">
              <ListTodo className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Todo List
            </h1>
          </div>
          <p className="text-slate-600">簡單高效地管理你的任務</p>
        </div>

        {/* Input Section - Glass Card */}
        <div className="bg-white/40 backdrop-blur-lg rounded-3xl shadow-lg border border-white/50 p-5 mb-6">
          <div className="flex gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="新增任務..."
              className="flex-1 px-5 py-3.5 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/60 
                         focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent
                         text-slate-700 placeholder:text-slate-400 transition-all shadow-inner"
            />
            <button
              onClick={addTodo}
              disabled={inputValue.trim() === ''}
              className="px-6 py-3.5 bg-gradient-to-r from-blue-500 to-purple-500 
                         hover:from-blue-600 hover:to-purple-600 
                         disabled:from-slate-300 disabled:to-slate-400
                         text-white rounded-2xl font-medium transition-all
                         flex items-center gap-2 shadow-lg hover:shadow-xl 
                         disabled:shadow-none hover:scale-105 active:scale-95"
            >
              <Plus className="w-5 h-5" />
              新增
            </button>
          </div>
        </div>

        {/* Filter Tabs - Glass Style */}
        <div className="flex gap-2 mb-4">
          {(['all', 'active', 'completed'] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2.5 rounded-xl font-medium transition-all ${
                filter === f
                  ? 'bg-white/70 backdrop-blur-md text-blue-600 shadow-lg border border-white/60'
                  : 'bg-white/30 backdrop-blur-sm text-slate-600 hover:bg-white/50 border border-white/40'
              }`}
            >
              {f === 'all' && `全部 (${todos.length})`}
              {f === 'active' && `進行中 (${activeCount})`}
              {f === 'completed' && `已完成 (${completedCount})`}
            </button>
          ))}
        </div>

        {/* Todo List - Glass Card */}
        <div className="bg-white/40 backdrop-blur-lg rounded-3xl shadow-lg border border-white/50 overflow-hidden">
          {filteredTodos.length === 0 ? (
            <div className="py-16 text-center">
              <div className="inline-flex p-4 bg-white/30 backdrop-blur-sm rounded-2xl mb-4">
                <ClipboardList className="w-12 h-12 text-slate-400" />
              </div>
              <p className="text-slate-500 text-lg">
                {filter === 'all' && '尚無任務，開始新增吧！'}
                {filter === 'active' && '沒有進行中的任務'}
                {filter === 'completed' && '尚未完成任何任務'}
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-white/30">
              {filteredTodos.map((todo) => (
                <li
                  key={todo.id}
                  className="group flex items-center gap-4 p-4 hover:bg-white/20 transition-all"
                >
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className="flex-shrink-0 transition-transform hover:scale-110"
                  >
                    {todo.completed ? (
                      <CheckCircle2 className="w-7 h-7 text-green-500 drop-shadow-sm" />
                    ) : (
                      <Circle className="w-7 h-7 text-slate-400 hover:text-blue-400" />
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
                    className="flex-shrink-0 p-2.5 rounded-xl text-slate-400 
                               opacity-0 group-hover:opacity-100
                               hover:bg-red-100/50 hover:text-red-500 transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer Stats - Glass Style */}
        {todos.length > 0 && (
          <div className="flex items-center justify-between mt-4 px-4 py-3 
                          bg-white/30 backdrop-blur-sm rounded-2xl border border-white/40">
            <span className="text-slate-600 text-sm">{activeCount} 個任務待完成</span>
            {completedCount > 0 && (
              <button
                onClick={clearCompleted}
                className="text-sm text-slate-500 hover:text-red-500 transition-colors"
              >
                清除已完成
              </button>
            )}
          </div>
        )}

        {/* Credit */}
        <p className="text-center text-slate-500 text-sm mt-8">
          Made with ❤️ by 廖小雄
        </p>
      </div>
    </div>
  );
}
