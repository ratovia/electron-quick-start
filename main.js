"use strict"

// Modules to control application life and create native browser window
const {app, ipcMain} = require('electron')
const path = require('path')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
const Window = require('./Window')
const DataStore = require('./Datastore')

const todosData = new DataStore({name: 'Todos Main'})

function main () {
  // Create the browser window.
  let mainWindow = new Window({
    file: path.join('renderer', 'index.html')
  })
  let addTodoWin

  mainWindow.once('show', ()=> {
    mainWindow.webContents.send('todos',todosData.todos)
  })

  ipcMain.on('add-todo-window', () => {
    if (!addTodoWin){
      addTodoWin = new Window({
        file: path.join('renderer', 'add.html'),
        width: 400,
        height: 400,
        parent: mainWindow
      })

      addTodoWin.on('closed', () => {
        addTodoWin = null
      })
    }
  })

  ipcMain.on('add-todo', (event, todo) => {
    const updatedTodos = todosData.addTodo(todo).todos

    mainWindow.send('todos', updatedTodos)
  })

  ipcMain.on('delete-todo', (event, todo) => {
    const updatedTodos = todosData.deleteTodo(todo).todos

    mainWindow.send('todos', updatedTodos)
  })
}
app.on('ready', main)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  app.quit()
})
