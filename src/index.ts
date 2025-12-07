import { defineExtension } from 'reactive-vscode';
import { commands, window, Uri, Range } from 'vscode';
import * as path from 'path';

const { activate, deactivate } = defineExtension((ctx) => {
  // Constants based on ctx
  const GIF_PATH_FORWARD = Uri.file(
    path.join(ctx.extensionPath, "assets", "pacman.webp")
  );
  const GIF_PATH_BACKWARD = Uri.file(
    path.join(ctx.extensionPath, "assets", "pacman-flipped-h.webp")
  );

  const PACMAN_CURSOR_DECORATION_FORWARD = window.createTextEditorDecorationType({
    before: {
      contentIconPath: GIF_PATH_FORWARD,
      margin: "5px 0 0 0",
      height: "10px",
      width: "10px",
    }
  });

  const PACMAN_CURSOR_DECORATION_BACKWARD = window.createTextEditorDecorationType({
    after: {
      contentIconPath: GIF_PATH_BACKWARD,
      margin: "5px 0 0 0",
      height: "10px",
      width: "10px",
    }
  });


  // Global state
  let lastCharacter = 0;

  commands.registerCommand('gameExtension.start', async () => {
    window.showInformationMessage('Starting mario game 🚀');
    const editor = window.activeTextEditor;
    if (!editor) return;

    const pos = editor.selection.active
    const range = new Range(pos, pos)

    editor.setDecorations(PACMAN_CURSOR_DECORATION_FORWARD, [range]);
    lastCharacter = pos.character;
  });

  window.onDidChangeTextEditorSelection(e => {
    const editor = e.textEditor
    const pos = editor.selection.active

    const range = new Range(pos, pos);
    const isMovingLeft = pos.character < lastCharacter;

    if (isMovingLeft) {
      editor.setDecorations(PACMAN_CURSOR_DECORATION_FORWARD, []);
      editor.setDecorations(PACMAN_CURSOR_DECORATION_BACKWARD, [range]);
    } else {
      editor.setDecorations(PACMAN_CURSOR_DECORATION_BACKWARD, []);
      editor.setDecorations(PACMAN_CURSOR_DECORATION_FORWARD, [range]);
    }
    lastCharacter = pos.character;
  });
})

export { activate, deactivate }
