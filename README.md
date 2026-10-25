# Full-Stack Machine Learning App

A FastAPI web app that trains and serves two scikit-learn models using the included **Top 1000 games of all time.csv** dataset:

- **Vote-count regression:** Predicts votes from a game's ranking and release year.
- **Primary-genre classification:** Predicts a game's first listed genre from ranking, release year, and vote count. Genres with fewer than 15 examples are grouped as `Other`.

The training script skips blank or incomplete CSV rows and saves the fitted models under `models/`. It prints held-out R² and accuracy scores after training. The genre data is imbalanced, so interpret accuracy in that context.

## Run locally (Windows)

Requires Python 3.10 or newer. From the project directory, run:

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
python train_models.py
uvicorn app:app --reload
```

Open <http://127.0.0.1:8000> for the prediction forms, <http://127.0.0.1:8000/docs> for interactive API documentation, or <http://127.0.0.1:8000/health> to check service health.

## Publish the source on GitHub

Create a **public** repository on GitHub, then run these commands from this project directory (replace the URL with your repository's URL):

```powershell
git init
git add .
git commit -m "Prepare app for public deployment"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

The virtual environment, generated model files, and assignment PDF are excluded from Git. The CSV dataset is included because the deployment needs it to train the models. Before making the repository public, make sure you have permission to share the dataset.

## Deploy the app publicly with Render

GitHub hosts the source code; it does not run this FastAPI backend. To make the app available at a public URL:

1. Push the project to a GitHub repository.
2. Sign in to [Render](https://render.com/) and choose **New** > **Blueprint**.
3. Connect the GitHub repository and deploy the blueprint. Render reads [`render.yaml`](render.yaml), installs the dependencies, trains the models, and starts the web service.
4. Open the public URL Render assigns to the service. The app and API docs are available at `/` and `/docs`.

The deployment uses the included dataset and does not require secrets or environment variables. The prediction API is public and has no authentication, so do not add private data to this app without adding appropriate access controls.
