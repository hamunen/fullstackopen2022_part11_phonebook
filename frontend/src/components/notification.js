//import React from 'react'

const successStyle = {
  color: 'green',
  fontSize: 16,
  background: 'lightgrey',
  borderStyle: 'solid',
  borderRadius: 5,
  padding: 10,
  marginBottom: 10
}

const errorStyle = {
  color: 'red',
  fontSize: 16,
  background: 'lightgrey',
  borderStyle: 'solid',
  borderRadius: 5,
  padding: 10,
  marginBottom: 10
}

const Notification = ({ notification }) => {
  if (notification === null) return null
  const style = notification.error ? errorStyle : successStyle

  return <div style={style}>{notification.text}</div>
}

export default Notification