import { defineExtension } from 'reactive-vscode'
import { commands, window } from 'vscode'

const { activate, deactivate } = defineExtension(() => {
  // console.log("Hello world!");
  // window.showInformationMessage('Hello')

  commands.registerCommand('gameExtension.start', () => {
    window.showInformationMessage('Starting mario game 🚀')
  });
})

export { activate, deactivate }
