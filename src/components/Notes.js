import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import noteContext from '../context/notes/noteContext'
import NoteItem from "./NoteItem";
import AddNote from "./AddNote";

const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;  
}

const Notes = (props) => {
    const context = useContext(noteContext);
    const { notes, getNotes, editNote} = context;
    let navigate = useNavigate();
    useEffect(() => {
        if(localStorage.getItem('token')) {
            getNotes();
        } 
        else {
         navigate("/login")
        }
        // eslint-disable-next-line
    }, [])

    const ref = useRef(null);
    const [note, setNote] = useState({id: "", etitle:"", edescription:"", etag:""});

    const updateNote = (currentNote) => {
        ref.current.click();
        setNote({id:currentNote._id, etitle: currentNote.title, edescription: currentNote.description, etag: currentNote.tag})
        
    }

    const handleClick = (e) => {
        editNote(note.id, note.etitle, note.edescription, note.etag);
        props.showAlert("Updated successfully", "success");
       }

    const onChange = (e) => {
        setNote({...note, [e.target.name]: e.target.value})
    }

    const [noteColors, setNoteColors] = useState({});

    const generateColorForNewNote = (noteId) => {
        if (!noteColors[noteId]) {
            const newNoteColors = { ...noteColors };
            newNoteColors[noteId] = getRandomColor();
            setNoteColors(newNoteColors);
        }
    };

    return (
        <>
            <AddNote showAlert={props.showAlert} />
            <button ref={ref} type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
                Launch demo modal
            </button>
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Edit Note</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="title" className="form-label">Title</label>
                                    <input type="text" className="form-control" id="etitle" name="etitle" value={note.etitle} aria-describedby="emailHelp" onChange={onChange} required/>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">Description</label>
                                    <input type="text" className="form-control" id="edescription" name="edescription" value={note.edescription} onChange={onChange} required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="tag" className="form-label">Tag</label>
                                    <input type="text" className="form-control" id="etag" name="etag" value={note.etag} onChange={onChange} />
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button disabled={note.etitle.length<3 || note.edescription.length<5} onClick={handleClick} type="button" className="btn btn-primary" data-bs-dismiss="modal">Update Note</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container">
                <h2>Your notes</h2>
                <div className="container mx-2 my-4">
                {notes.length===0 && "No notes to display"}
                </div>
                <div className="row">
                    {notes.map((note) => {
                         generateColorForNewNote(note._id);
                        return <NoteItem key={note._id} updateNote={updateNote} showAlert={props.showAlert} note={note} color={noteColors[note._id]} />
                    })}
                </div>
            </div>
        </>
    )
}

export default Notes;