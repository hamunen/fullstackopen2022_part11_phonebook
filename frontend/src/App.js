import /*React, */ { useEffect, useState } from 'react'
import entryService from './services/entries'
import Notification from './components/notification'

const Filter = ({ filterName, setFilterName }) =>
  <div>
    filter shown with <input value={filterName} onChange={(e) => setFilterName(e.target.value)} />
  </div>

const NewEntryForm = ({ addName, newName, newNumber, setNewName, setNewNumber }) =>
  <form onSubmit={addName}>
    <div>name: <input value={newName} onChange={(e) => setNewName(e.target.value)} /> </div>
    <div>number: <input value={newNumber} onChange={(e) => setNewNumber(e.target.value)} /></div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>

const EntryList = ({ entries, filterName, deleteEntry }) => {

  return <>
    {entries
      .filter((e) => e.name.toUpperCase().includes(filterName.toUpperCase()))
      .map((e) =>
        <div key={e.name}>{e.name} {e.number}
          <button onClick={() => deleteEntry(e)}>delete</button>
        </div>)
    }
  </>
}

const App = () => {
  const [entries, setEntries] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterName, setFilterName] = useState('')
  const [message, setMessage] = useState(null)

  useEffect(() => {
    entryService
      .getAll()
      .then(initialEntries => {
        setEntries(initialEntries)
      })
  }, [])

  const updateMessage = (text, error = false) => {
    setMessage({ text, error })
    setTimeout(() => setMessage(null), 5000)
  }

  const addEntry = (event) => {
    event.preventDefault()
    const newNameTrimmed = newName.trim()
    const newNumberTrimmed = newNumber.trim()

    if (newNameTrimmed === '' || newNumberTrimmed === '') {
      alert('Name or number is empty')
      return
    }

    const existingEntry = entries.find(e => e.name.toUpperCase() === newNameTrimmed.toUpperCase())
    if (existingEntry) {
      updateEntry({ ...existingEntry, number: newNumberTrimmed })
      return
    }

    const newEntry = {
      name: newNameTrimmed,
      number: newNumberTrimmed
    }

    entryService
      .create(newEntry)
      .then(returnedEntry => {
        setEntries(entries.concat(returnedEntry))
        setNewName('')
        setNewNumber('')
        updateMessage(`Added ${returnedEntry.name}!`)
      })
      .catch(error => {
        updateMessage(error.response.data.error, error = true)
      })
  }

  const deleteEntry = (entry) => {
    if (window.confirm(`Delete ${entry.name}?`)) {
      entryService
        .del(entry.id)
        .then(() => {
          setEntries(entries.filter(e => e.id !== entry.id))
          updateMessage(`Succesfully deleted ${entry.name}!`)
        })
        .catch(() => {
          updateMessage(`Information of ${entry.name} has already been removed from the server. Weird!`, true)
          setEntries(entries.filter(e => e.id !== entry.id))
        })
    }
  }

  const updateEntry = (entry) => {
    if (window.confirm(`This ${entry.name} person is already added to phonebook, replace the old number with a new one? OK?`)) {
      entryService
        .update(entry)
        .then(returnedEntry => {
          setEntries(entries.map(e => e.id !== returnedEntry.id ? e : returnedEntry))
          updateMessage(`Number updated for ${returnedEntry.name}!`)
          setNewName('')
          setNewNumber('')
        })
        .catch(error => {
          updateMessage(error.response.data.error, error = true)
        })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={message} />
      <Filter filterName={filterName} setFilterName={setFilterName}/>
      <h2>add a new</h2>
      <NewEntryForm
        addName = {addEntry}
        newName = {newName}
        newNumber = {newNumber}
        setNewName = {setNewName}
        setNewNumber = {setNewNumber}/>
      <h2>Numbers</h2>
      <EntryList entries={entries} filterName={filterName} deleteEntry={deleteEntry} />
    </div>
  )
}

export default App