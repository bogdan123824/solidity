// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

struct Note {
    string title;
    string content;
    uint256 timestamp;
}

contract NotesManager {
    Note[] private _notes;

    constructor() payable {
        _notes.push(Note("First test note", "This is the first note", block.timestamp));
    }

    function getAllNotes() public view returns (Note[] memory) {
        return _notes;
    }

    function getNoteById(uint256 index) public view returns (Note memory) {
        require(index < _notes.length, "Note is not found");
        return _notes[index];
    }

    function addNote(string memory title, string memory content) public payable {
        _notes.push(Note(title, content, block.timestamp));
    }

    function updateNote(uint256 index, string memory title, string memory content) public payable {
        require(index < _notes.length, "Note is not found");
        _notes[index] = Note(title, content, block.timestamp);
    }

    function deleteNote(uint256 index) public payable {
        require(index < _notes.length, "Note is not found");
        _notes[index] = _notes[_notes.length - 1];
        _notes.pop();
    }
}