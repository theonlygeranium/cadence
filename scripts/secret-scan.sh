#!/usr/bin/env bash
set -euo pipefail

mode="${1:-all}"

usage() {
  printf 'Usage: scripts/secret-scan.sh [all|staged]\n' >&2
}

case "$mode" in
  all)
    file_cmd=(git ls-files -co --exclude-standard)
    ;;
  staged)
    file_cmd=(git diff --cached --name-only --diff-filter=ACMRT)
    ;;
  *)
    usage
    exit 2
    ;;
esac

tmp_file="$(mktemp)"
trap 'rm -f "$tmp_file"' EXIT

"${file_cmd[@]}" |
  grep -Ev '(^|/)(node_modules|\.git|\.next|coverage|test-results|playwright-report)/' |
  grep -Ev '(^package-lock\.json$|^\.gitignore$|^scripts/secret-scan\.sh$)' > "$tmp_file" || true

if [[ ! -s "$tmp_file" ]]; then
  printf 'Secret scan passed: no files to scan.\n'
  exit 0
fi

findings="$(
  xargs awk '
    function report(name) {
      printf "%s:%d:%s\n", FILENAME, FNR, name
      found = 1
    }
    /cfat_[A-Za-z0-9_-]{20,}/ { report("cloudflare-api-token") }
    /github_pat_[A-Za-z0-9_]{20,}/ { report("github-pat") }
    /gh[pousr]_[A-Za-z0-9_]{20,}/ { report("github-token") }
    /-----BEGIN ([A-Z0-9 ]*)?PRIVATE KEY-----/ { report("private-key") }
    /AKIA[0-9A-Z]{16}/ { report("aws-access-key") }
    /PLAID_SECRET[[:space:]]*=[[:space:]]*[^#[:space:]]+/ &&
      $0 !~ /(your_|placeholder|from_\.env|secret_matching|PLAID_SECRET=)$/ {
      report("plaid-secret")
    }
    /DATABASE_URL[[:space:]]*=[[:space:]]*postgres(ql)?:\/\/[^:[:space:]]+:[^@[:space:]]+@/ &&
      $0 !~ /(your_|placeholder|ci_placeholder)/ {
      report("database-url-with-password")
    }
    END { exit found ? 1 : 0 }
  ' < "$tmp_file" 2>/dev/null
)" || true

if [[ -n "$findings" ]]; then
  printf 'Secret scan failed. Potential sensitive values found:\n' >&2
  printf '%s\n' "$findings" >&2
  exit 1
fi

printf 'Secret scan passed.\n'
