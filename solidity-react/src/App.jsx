import Web3 from "web3";
import Card from "./components/Card";
import Input from "./components/Input";
import Button from "./components/Button";
import abi from "./contracts/Contract.json";
import TextArea from "./components/TextArea";
import CardContent from "./components/CardContent";
import { formatTimestamp } from "./helpers/formatters";
import { useCallback, useEffect, useState } from "react";
import { NETWORK_ADDRESS, CONTRACT_ADDRESS } from "./contracts/Config";

export default function NotesApp() {
    const [notes, setNotes] = useState([]);

    const [account, setAccount] = useState(null);
    const [contract, setContract] = useState(null);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [editingIndex, setEditingIndex] = useState(null);

    const fetchNotes = useCallback(async () => {
        if (!contract) return;

        const notes = await contract.methods
            .getAllNotes()
            .call({ from: account });

        setNotes(notes);
    }, [contract, account]);

    useEffect(() => {
        const init = async () => {
            const web3 = new Web3(NETWORK_ADDRESS);

            const accounts = await web3.eth.getAccounts();
            setAccount(accounts[0]);

            const instance = new web3.eth.Contract(abi, CONTRACT_ADDRESS);
            setContract(instance);
        };
        init();
        fetchNotes();
    }, []);

    const addNote = async () => {
        if (!title || !content) return;

        try {
            await contract.methods
                .addNote(title, content)
                .send({ from: account, gas: 300000 });

            await fetch("http://127.0.0.1:8000/notes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title,
                    content,
                    timestamp: Date.now(),
                    created_by: account.toString()
                })
            });
        } catch {
            alert("Error occurred while adding note");
        }

        await fetchNotes();

        setTitle("");
        setContent("");
    };

    const updateNote = async () => {
        if (!title || !content || editingIndex === null) return;

        try {
            await contract.methods
                .updateNote(editingIndex, title, content)
                .send({ from: account, gas: 300000 });

            const note = notes.find(x => x.id === editingIndex);

            await fetch("http://127.0.0.1:8000/notes/" + note.title, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title,
                    content,
                    timestamp: Date.now(),
                    created_by: account.toString()
                })
            });
        } catch {
            alert("Error occurred while editing note");
        }

        await fetchNotes();

        setTitle("");
        setContent("");
        setEditingIndex(null);
    };

    const editNote = index => {
        const note = notes.find(x => x.id === index);

        setTitle(note.title);
        setContent(note.content);
        setEditingIndex(index);
    };

    const deleteNote = async index => {
        const note = notes.find(x => x.id === index);

        try {
            await contract.methods.deleteNote(index).send({ from: account });

            await fetch("http://127.0.0.1:8000/notes/" + note.title, {
                method: "DELETE"
            });
        } catch {
            alert("Error occurred while deleting note");
        }

        await fetchNotes();
    };

    return (
        <div className="p-4 max-w-lg mx-auto space-y-4">
            <div className="space-y-2">
                <Input
                    placeholder="Title"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                />
                <TextArea
                    placeholder="Content"
                    value={content}
                    onChange={e => setContent(e.target.value)}
                />
                <Button onClick={editingIndex === null ? addNote : updateNote}>
                    {editingIndex === null ? "Add Note" : "Update Note"}
                </Button>
            </div>
            <div className="space-y-2">
                {notes.map(note => {
                    return (
                        <Card key={note.timestamp}>
                            <CardContent className="space-y-2">
                                <h3 className="text-xl font-bold">
                                    {note.title}
                                </h3>
                                <p>{note.content}</p>
                                <p>{formatTimestamp(note.timestamp)}</p>
                                <div className="flex space-x-2">
                                    <Button onClick={() => editNote(note.id)}>
                                        Edit
                                    </Button>
                                    <Button onClick={() => deleteNote(note.id)}>
                                        Delete
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}