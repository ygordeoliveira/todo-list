import './App.css';
import { useState, useEffect } from "react";
import { BsTrash, BsBookmarkCheck, BsBookmarkCheckFill } from "react-icons/bs";

const API = "https://todo-list-backend-production-bcf1.up.railway.app/todos";

function App() {
    const [user, setUser] = useState("");
    const [isLogged, setIsLogged] = useState(false);
    const [title, setTitle] = useState("");
    const [time, setTime] = useState("");
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);

            try {
                const res = await fetch(`${API}?userId=${user}`);
                const data = await res.json();

                if (Array.isArray(data)) {
                    setTodos(data);
                } else {
                    setTodos([]);
                }
            } catch (err) {
                console.error("Erro ao carregar os dados:", err);
                setTodos([]);
            }

            setLoading(false);
        };

        if (user) {
            loadData();
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const todo = {
            id: String(Date.now()),
            title,
            time,
            done: false,
            userId: user,
        };

        await fetch(API, {
            method: "POST",
            body: JSON.stringify(todo),
            headers: {
                "Content-Type": "application/json",
            },
        });

        setTodos((prevState) => [...prevState, todo]);

        setTitle("");
        setTime("");
    };

    const handleDelete = async (id) => {
        await fetch(`${API}/${id}`, {
            method: "DELETE",
        });
        setTodos((prevState) => prevState.filter((todo) => todo.id !== id));
    };

    const handleEdit = async (todo) => {
        todo.done = !todo.done;

        const res = await fetch(`${API}/${todo.id}`, {
            method: "PUT",
            body: JSON.stringify(todo),
            headers: {
                "Content-Type": "application/json",
            },
        });

        const updated = await res.json();

        setTodos((prevState) =>
            prevState.map((t) => (t.id === updated.id ? updated : t))
        );
    };

    if (!isLogged) {
        return (
            <div className="App">
                <div className="todo-header">
                    <h1>React Todo</h1>
                </div>
                <div className="form-todo">
                    <h2>Informe seu nome para entrar:</h2>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        if (user.trim() !== "") {
                            setIsLogged(true);
                        }
                    }}>
                        <div className="form-control">
                            <input
                                type="text"
                                placeholder="Seu nome"
                                value={user}
                                onChange={(e) => setUser(e.target.value)}
                                required
                            />
                        </div>
                        <input type="submit" value="Entrar" />
                    </form>
                </div>
            </div>
        );
    }

    if (loading) {
        return <p>Carregando...</p>;
    }

    return (
        <div className="App">
            <div className="todo-header">
                <h1>React Todo</h1>
                <p>Usuário: <strong>{user}</strong></p>
            </div>
            <div className="form-todo">
                <h2>Insira a sua próxima tarefa:</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-control">
                        <label htmlFor="title">O que você vai fazer?</label>
                        <input
                            type="text"
                            name="title"
                            placeholder="Título da tarefa"
                            onChange={(e) => setTitle(e.target.value)}
                            value={title || ""}
                            required
                        />
                    </div>

                    <div className="form-control">
                        <label htmlFor="time">Duração:</label>
                        <input
                            type="text"
                            name="time"
                            placeholder="Tempo estimado (em horas)"
                            onChange={(e) => setTime(e.target.value)}
                            value={time || ""}
                            required
                        />
                    </div>
                    <input type="submit" value="Criar tarefa" />
                </form>
            </div>
            <div className="list-todo">
                <h2>Lista de tarefas: </h2>
                {todos.length === 0 && <p>Não há tarefas!</p>}
                {todos.map((todo) => (
                    <div className="todo" key={todo.id}>
                        <h3 className={todo.done ? "todo-done" : ""}>{todo.title}</h3>
                        <p>Duração: {todo.time}</p>
                        <div className="actions">
                            <span onClick={() => handleEdit(todo)}>
                                {!todo.done ? <BsBookmarkCheck /> : <BsBookmarkCheckFill />}
                            </span>
                            <BsTrash onClick={() => handleDelete(todo.id)} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;