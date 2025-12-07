import { defineExtension } from 'reactive-vscode';
import { commands, window, Uri, Range, Position, StatusBarItem, StatusBarAlignment } from 'vscode';
import * as path from 'path';

const { activate, deactivate } = defineExtension((ctx) => {
  // Constants based on ctx
  const GIF_PATH_FORWARD = Uri.file(
    path.join(ctx.extensionPath, "assets", "pacman.webp")
  );
  const GIF_PATH_BACKWARD = Uri.file(
    path.join(ctx.extensionPath, "assets", "pacman-flipped-h.webp")
  );

  const EATEN_DECORATION = window.createTextEditorDecorationType({
    backgroundColor: "red",
    fontStyle: "color: white"
  })

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
  let eatenRanges: Range[] = [];
  let eatenContent: string[] = [];
  let scoreBar: StatusBarItem;

  commands.registerCommand('gameExtension.start', async () => {
    eatenContent = [];
    // Setup score bar
    scoreBar = window.createStatusBarItem(StatusBarAlignment.Right, 100)
    scoreBar.text = `Score: 0`
    scoreBar.show()

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

    // Check for eat logic and only add if not already eaten
    const charRange = new Range(pos, pos.translate(0, 1)) // 1 character
    const cursorRange = new Range(pos, pos) // Pac-Man cursor

    const char = editor.document.getText(charRange);
    if (char && !eatenRanges.some(r => r.isEqual(charRange))) {
      eatenRanges.push(charRange);
      eatenContent.push(char);
    }

    // Update directions
    const isMovingLeft = pos.character < lastCharacter;

    if (isMovingLeft) {
      editor.setDecorations(PACMAN_CURSOR_DECORATION_FORWARD, []);
      editor.setDecorations(PACMAN_CURSOR_DECORATION_BACKWARD, [cursorRange]);
    } else {
      editor.setDecorations(PACMAN_CURSOR_DECORATION_BACKWARD, []);
      editor.setDecorations(PACMAN_CURSOR_DECORATION_FORWARD, [cursorRange]);
    }

    // Mark lines as eaten
    // Apply red bg to eaten content
    editor.setDecorations(EATEN_DECORATION, eatenRanges);
    scoreBar.text = `Score: ${eatenContent.length}`
    lastCharacter = pos.character;
  });
})

export { activate, deactivate }
