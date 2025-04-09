
#!/bin/bash

# Run Flask backend in the background
echo "Starting Flask backend..."
python app.py &
FLASK_PID=$!

# Run frontend dev server
echo "Starting React frontend..."
npm run dev

# When frontend server is stopped, also stop the Flask server
echo "Stopping Flask backend..."
kill $FLASK_PID
