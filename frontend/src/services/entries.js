import axios from 'axios'
const baseUrl = '/api/persons'

const getAll = () => axios.get(baseUrl).then(response => response.data)

const create = (newEntry) => axios.post(baseUrl, newEntry).then(response => response.data)

const del = (idToDelete) => axios.delete(`${baseUrl}/${idToDelete}`)

const update = (newEntry) => axios.put(`${baseUrl}/${newEntry.id}`, newEntry).then(response => response.data)

export default { getAll, create, del, update }