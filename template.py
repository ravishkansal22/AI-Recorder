from pathlib import Path

PROJECT_NAME = "recorder-platform"

folders = [
    "frontend/public",
    "frontend/src/components",
    "frontend/src/pages",
    "frontend/src/services",
    "frontend/src/hooks",
    "frontend/src/styles",

    "backend/api",
    "backend/recorder",
    "backend/generators",
    "backend/browser",
    "backend/models",
    "backend/exports",
    "backend/tests",

    "shared"
]

files = [
    "frontend/package.json",
    "frontend/vite.config.js",

    "frontend/src/App.jsx",

    "frontend/src/components/UrlBar.jsx",
    "frontend/src/components/RecorderControls.jsx",
    "frontend/src/components/RecordedSteps.jsx",
    "frontend/src/components/CodeEditor.jsx",
    "frontend/src/components/BrowserStatus.jsx",

    "frontend/src/pages/Home.jsx",

    "frontend/src/services/api.js",
    "frontend/src/services/socket.js",

    "frontend/src/hooks/useRecorder.js",

    "backend/app.py",

    "backend/api/recorder.py",
    "backend/api/browser.py",
    "backend/api/export.py",

    "backend/recorder/event_capture.py",
    "backend/recorder/selector_builder.py",
    "backend/recorder/session_manager.py",
    "backend/recorder/event_store.py",

    "backend/generators/base_generator.py",
    "backend/generators/playwright_generator.py",
    "backend/generators/selenium_generator.py",

    "backend/browser/playwright_driver.py",
    "backend/browser/injection.js",

    "backend/models/action.py",
    "backend/models/session.py",

    "backend/requirements.txt",

    "shared/constants.py",
    "shared/schemas.py",

    "README.md"
]


def create_structure():
    root = Path(PROJECT_NAME)

    root.mkdir(exist_ok=True)

    for folder in folders:
        path = root / folder
        path.mkdir(parents=True, exist_ok=True)

    for file in files:
        path = root / file

        path.parent.mkdir(parents=True, exist_ok=True)

        if not path.exists():
            path.touch()

    print(f"\nProject created: {PROJECT_NAME}\n")

    for item in root.rglob("*"):
        print(item.relative_to(root))


if __name__ == "__main__":
    create_structure()