from pathlib import Path

PROJECT_NAME = "web-recorder"

folders = [
    "frontend/public",

    "frontend/src/components",
    "frontend/src/pages",
    "frontend/src/services",
    "frontend/src/hooks",
    "frontend/src/styles",

    "backend/src/routes",
    "backend/src/controllers",
    "backend/src/services",
    "backend/src/recorder",
    "backend/src/generators",
    "backend/src/models",
    "backend/src/utils",

    "shared",

    "recordings/sessions",
    "recordings/exports",

    "docs",
]

files = [
    "frontend/public/logo.png",

    "frontend/src/components/UrlInput.jsx",
    "frontend/src/components/RecorderControls.jsx",
    "frontend/src/components/RecordedSteps.jsx",
    "frontend/src/components/CodeViewer.jsx",
    "frontend/src/components/Header.jsx",

    "frontend/src/pages/Home.jsx",

    "frontend/src/services/api.js",
    "frontend/src/services/socket.js",

    "frontend/src/hooks/useRecorder.js",

    "frontend/src/styles/globals.css",

    "frontend/src/App.jsx",
    "frontend/src/main.jsx",

    "frontend/package.json",
    "frontend/vite.config.js",

    "backend/src/server.js",

    "backend/src/routes/recorderRoutes.js",

    "backend/src/controllers/recorderController.js",

    "backend/src/services/browserService.js",
    "backend/src/services/recordingService.js",
    "backend/src/services/socketService.js",

    "backend/src/recorder/eventCapture.js",
    "backend/src/recorder/selectorBuilder.js",
    "backend/src/recorder/recorderScript.js",

    "backend/src/generators/playwrightGenerator.js",
    "backend/src/generators/seleniumGenerator.js",

    "backend/src/models/recordingSession.js",

    "backend/src/utils/constants.js",
    "backend/src/utils/logger.js",

    "backend/package.json",
    "backend/.env",

    "shared/eventTypes.js",
    "shared/selectors.js",

    "docs/architecture.md",
    "docs/api.md",

    "README.md",
    ".gitignore",
]

root = Path(PROJECT_NAME)

for folder in folders:
    (root / folder).mkdir(parents=True, exist_ok=True)

for file in files:
    filepath = root / file
    filepath.parent.mkdir(parents=True, exist_ok=True)

    if not filepath.exists():
        filepath.touch()

print(f"\nProject structure created successfully!")
print(f"Location: {root.resolve()}")