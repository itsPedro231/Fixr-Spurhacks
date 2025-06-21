# spurhacks

Hackathon project.

## Backend

  Run these in terminal to create virtual environment, update pip and install necessary packages.

  ```python
  python -m venv .venv
  source .venv/bin/activate
  python -m pip install --upgrade pip
  echo "*" > .venv/.gitignore
  pip install -r requirements.txt
  ```

### Gemini intsructions
First make sure all pip dependencies are installed, including `uvicorn` for running the FastAPI endpoint
In the backend folder, run `uvicorn main:app --reload`
Once this is running, in a separate terminal run (copy paste the whole thing and hit enter)
```
curl -X POST "http://localhost:8000/analyze-image/" \
  -H "accept: application/json" \
  -H "Content-Type: multipart/form-data" \
  -F "image=@test_images/broken-sink.png"
```
