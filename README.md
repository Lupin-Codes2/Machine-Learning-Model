# Full-Stack Machine Learning App

A FastAPI web app that trains and serves two scikit-learn models using the included **Top 1000 games of all time.csv** dataset:

- **Vote-count regression:** Predicts votes from a game's ranking and release year.
- **Primary-genre classification:** Predicts a game's first listed genre from ranking, release year, and vote count. Genres with fewer than 15 examples are grouped as `Other`.

The classifier includes an optional game-name search that fills in the selected game's ranking, release year, and vote count from the dataset. Results distinguish the predicted primary genre from the game's full dataset genre tags and report prediction confidence separately from held-out test accuracy.

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

## GitHub source repository

This project is maintained in [Lupin-Codes2/Machine-Learning-Model](https://github.com/Lupin-Codes2/Machine-Learning-Model). Push changes to its `main` branch; Render can use that repository as its deployment source.

The virtual environment, generated model files, and assignment PDF are excluded from Git. The CSV dataset is included because the deployment needs it to train the models. Before making the repository public, make sure you have permission to share the dataset.

## Deploy the app publicly with Render

GitHub stores the source code; Render runs the FastAPI app. For the complete working app, connect Render to **Lupin-Codes2/Machine-Learning-Model** and use the Render service URL (not the `github.io` URL):

1. In [Render](https://render.com/), choose **New** > **Blueprint** and connect the `Lupin-Codes2/Machine-Learning-Model` repository.
2. Render reads [`render.yaml`](render.yaml), installs the dependencies, trains the models, and starts the web service.
3. Open the `onrender.com` URL shown for that service. The app and API docs are available at `/` and `/docs`; the prediction forms work there because the frontend and API are served by the same service.

When the Render service is connected to the repository, pushes to `main` can trigger a new deployment. GitHub Pages is a separate static site and cannot run this FastAPI backend; use its `github.io` URL only for static content.

The deployment uses the included dataset and does not require secrets or environment variables. The prediction API is public and has no authentication, so do not add private data to this app without adding appropriate access controls.
