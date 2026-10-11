# learn-ai-with-me
#
#   make start    install deps if needed, then run the Vite dev server
#   make deploy   build, push main, GitHub Actions publishes Pages
#
# Requires Node 18+. Deploy needs git remote access; `gh` is optional
# (used only to re-run the workflow when main is already up to date).

NPM  ?= npm
GH   ?= gh
SITE := https://handonn2000.github.io/learn-ai-with-me/

.PHONY: help start install build preview deploy

help:
	@printf '%s\n' \
	  'make start    Quick-start the app (npm ci if needed + Vite on :5173)' \
	  'make deploy   Deploy to GitHub Pages via .github/workflows/deploy.yml' \
	  'make build    Production build → dist/' \
	  'make preview  Serve the production build locally'

# First clone: npm ci from the lockfile. Later runs skip install unless
# package.json or package-lock.json changed.
start: node_modules
	$(NPM) run dev

install: node_modules

node_modules: package.json package-lock.json
	$(NPM) ci
	@touch $@

build: node_modules
	$(NPM) run build
	# BrowserRouter + GitHub Pages: unknown paths fall back to 404.html,
	# which is a copy of index.html so the client router can take over.
	cp dist/index.html dist/404.html

preview: build
	$(NPM) run preview

# Pages only publishes from main (push or workflow_dispatch).
# A local production build runs first so a type/build failure never goes out.
deploy: build
	@branch=$$(git rev-parse --abbrev-ref HEAD); \
	if [ "$$branch" != "main" ]; then \
	  echo "error: GitHub Pages publishes from main; current branch is '$$branch'" >&2; \
	  echo "Merge or rebase onto main, then run make deploy again." >&2; \
	  exit 1; \
	fi
	@if ! git diff --quiet || ! git diff --cached --quiet; then \
	  echo "error: working tree is dirty — commit or stash before deploying" >&2; \
	  exit 1; \
	fi
	@remote=$$(git rev-parse --abbrev-ref --symbolic-full-name @{u} 2>/dev/null || true); \
	if [ -n "$$remote" ]; then \
	  before=$$(git rev-parse $$remote); \
	else \
	  before=; \
	fi; \
	git push origin main; \
	after=$$(git rev-parse origin/main); \
	if [ -n "$$before" ] && [ "$$before" = "$$after" ]; then \
	  if command -v $(GH) >/dev/null 2>&1; then \
	    echo "origin/main already up to date — dispatching Deploy lên GitHub Pages"; \
	    $(GH) workflow run deploy.yml --ref main; \
	  else \
	    echo "origin/main already up to date. Install GitHub CLI (gh) to rebuild Pages,"; \
	    echo "or run the workflow from the Actions tab."; \
	  fi; \
	fi
	@echo "Publishing $(SITE)"
	@echo "Watch: $(GH) run list --workflow=deploy.yml --limit 3"
