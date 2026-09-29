export class InputSystem {
  private keys = new Set<string>();

  constructor() {
    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);
  }

  private handleKeyDown = (event: KeyboardEvent) => {
    this.keys.add(event.code);
    console.log(`Key pressed: ${event.code}`);
  };

  private handleKeyUp = (event: KeyboardEvent) => {
    this.keys.delete(event.code);
    console.log(`Key released: ${event.code}`);
  };

  isPressed(code: string) {
    return this.keys.has(code);
  }

  destroy() {
    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("keyup", this.handleKeyUp);

    this.keys.clear();
  }
}