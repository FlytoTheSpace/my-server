import tkinter as tk
from tkinter import PhotoImage
import subprocess
import threading
import os


os.chdir('../')

class NodeJSRunner:
    def __init__(self, root):
        self.root = root
        self.root.title("Server Control Panel")

        # Set window size and position
        self.root.geometry("800x500+300+200")

        # Dark theme colors
        self.root.configure(bg="#333333")
        self.root.option_add("*background", "#333333")
        self.root.option_add("*foreground", "white")

        # Frame for buttons
        self.button_frame = tk.Frame(root, bg="#333333")
        self.button_frame.pack(side=tk.TOP, fill=tk.X)

        # Start button with icon
        start_icon = PhotoImage(file="./bin/start_icon.png")
        self.start_button = tk.Button(self.button_frame, text="Start", image=start_icon, compound=tk.LEFT, command=self.start_nodejs, bg="#444444", fg="white")
        self.start_button.image = start_icon
        self.start_button.pack(side=tk.LEFT, padx=10, pady=5)

        # Stop button with icon
        stop_icon = PhotoImage(file="./bin/stop_icon.png")
        self.stop_button = tk.Button(self.button_frame, text="Stop", image=stop_icon, compound=tk.LEFT, command=self.stop_nodejs, state=tk.DISABLED, bg="#444444", fg="white")
        self.stop_button.image = stop_icon
        self.stop_button.pack(side=tk.LEFT, padx=10, pady=5)

        # Log display
        self.log_frame = tk.Frame(root, bg="#333333")
        self.log_frame.pack(side=tk.TOP, fill=tk.BOTH, expand=True, padx=10, pady=10)

        self.log_display = tk.Text(self.log_frame, bg="#222222", fg="white")
        self.log_display.pack(fill=tk.BOTH, expand=True)

        self.node_process = None

    def start_nodejs(self):
        self.node_process = subprocess.Popen(["node", "./server/index.js"], stdout=subprocess.PIPE, stderr=subprocess.STDOUT, universal_newlines=True)
        self.start_button.config(state=tk.DISABLED)
        self.stop_button.config(state=tk.NORMAL)
        self.thread = threading.Thread(target=self.display_logs)
        self.thread.start()

    def stop_nodejs(self):
        if self.node_process:
            self.node_process.terminate()
            self.start_button.config(state=tk.NORMAL)
            self.stop_button.config(state=tk.DISABLED)

    def display_logs(self):
        while self.node_process.poll() is None:
            output = self.node_process.stdout.readline()
            self.log_display.insert(tk.END, output)
            self.log_display.see(tk.END)
            self.root.update()

if __name__ == "__main__":
    root = tk.Tk()
    app = NodeJSRunner(root)
    root.mainloop()
