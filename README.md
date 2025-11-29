 # Website (GitHub Pages)

 This repository contains a static website (HTML/CSS/JS) designed to render Markdown posts client-side and support light/dark themes.

 How to publish on GitHub Pages

 1. Create a new repository on GitHub. If you want a user/organization site, name the repository `<your-username>.github.io` (this will serve at `https://<your-username>.github.io`). For a project site, any repo name works and Pages will serve at `https://<your-username>.github.io/<repo>`.

 2. Push this repository to GitHub (replace `<remote-url>` with your repo URL):

 ```bash
 git init
 git add .
 git commit -m "Initial site"
 git branch -M main
 git remote add origin <remote-url>
 git push -u origin main
 ```

 3. This repository includes a GitHub Actions workflow that automatically deploys the repository root to GitHub Pages when you push to `main`.

 Notes
 - The workflow uses the built-in Pages actions; no extra secrets are required.
 - If you prefer to deploy a subfolder such as `docs/`, update the workflow or move site files into `docs/` and configure Pages accordingly.
 - If your files include underscores or you want to bypass Jekyll, `.nojekyll` is present in the repo root.

 Local testing

 Start a simple local server and open `http://localhost:8000`:

 ```bash
 python3 -m http.server 8000
 ```

 If you want me to push this repo to GitHub and enable Pages, provide the repository URL or your GitHub username and whether you want a user site (`username.github.io`) or a project site.
