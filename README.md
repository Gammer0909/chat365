# Chat365

A stupidly simple Websockets based chat app built in React and Go.

This was built to learn React better. I'm fairly comfortable with Go, but I've been wanting to learn React so this was a great project to help build my foundations with it! 

(I'm also new to Goroutines and channels, so don't judge me too much there!)

## Running The Project

1. Clone the repo

`git clone "https://github.com/Gammer0909/chat365.git"`

2. Start the server

Open a terminal, and run

`go run main.go`

(make sure you have `gorilla/websockets` installed)

Then to start the frontend, run

`npm install`

then,

`npm start`

and go to http://localhost:3000/

If you have any problems feel free to open an issue.

## Project Details

Some brief project details if you're looking into the files:
- **ALL** frontend files are in `src/`, and anything backend related is in `backend/` (duh)
- If there's anything that seems overly dumb or stupid, I *should* have a comment nearby explaining my decision. If I don't open an issue and I'll explain it and add a comment for future reference.
- This is my like 3rd react project ever, so if anything is a bad practice or something I should not get used to using, please let me know!
