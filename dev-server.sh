#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

export PC_PORT_NUM="${PC_PORT_NUM:-9996}"
DEV_PORT="${DEV_PORT:-3004}"

cleanup_services() {
  timeout 10s mise x -- process-compose down >/dev/null 2>&1 || true

  pkill -TERM -f 'process-compose up -f dev-services.yaml' || true
  pkill -TERM -f 'pnpm exec vite --host 0.0.0.0 --port 3004' || true
  pkill -TERM -f 'vite --host 0.0.0.0 --port 3004' || true
  sleep 1
  pkill -KILL -f 'process-compose up -f dev-services.yaml' || true
  pkill -KILL -f 'pnpm exec vite --host 0.0.0.0 --port 3004' || true
  pkill -KILL -f 'vite --host 0.0.0.0 --port 3004' || true
}

trap '[[ "${1:-}" == "up" ]] && cleanup_services' INT TERM

case "${1:-up}" in
  up)
    output=$(mise x -- process-compose process list -o wide 2>/dev/null) || true
    if [ -n "$output" ]; then
      if echo "$output" | grep -Eq 'Running|Ready'; then
        echo "$output"
        exit 0
      fi
      echo "Found stale process-compose state, cleaning it up..."
      cleanup_services
    fi

    if [ -t 0 ]; then
      mise x -- process-compose up -f dev-services.yaml --detached-with-tui --detach-on-success
    else
      mise x -- process-compose up -f dev-services.yaml --detached -t=false
      echo "Waiting for server to be ready..."
      ready=false
      for _ in {1..120}; do
        web=$(bash -c "echo > /dev/tcp/localhost/${DEV_PORT}" 2>/dev/null && echo "ok" || echo "fail")
        if [ "$web" = "ok" ]; then
          echo "Server ready at http://localhost:${DEV_PORT}"
          ready=true
          break
        fi

        status=$(mise x -- process-compose process list -o wide 2>/dev/null || true)
        if [ -z "$status" ]; then
          echo "Process compose stopped before the server became ready."
          exit 1
        fi

        echo "  waiting: web=$web"
        sleep 1
      done

      if [ "$ready" != "true" ]; then
        echo "Server did not become ready at http://localhost:${DEV_PORT}"
        echo
        echo "Process status:"
        mise x -- process-compose process list -o wide 2>/dev/null || true
        echo
        echo "Recent vite logs:"
        mise x -- process-compose process logs vite -n 100 --raw-log 2>/dev/null || true
        exit 1
      fi
    fi
    ;;
  tui)
    mise x -- process-compose process list -o wide 2>/dev/null | grep -q . || { echo "No Processes Running"; exit 1; }
    mise x -- process-compose attach
    ;;
  ps)
    output=$(mise x -- process-compose process list -o wide 2>/dev/null) || true
    if [ -z "$output" ]; then echo "No Processes Running"; else echo "$output"; fi
    ;;
  logs)
    mise x -- process-compose process list -o wide 2>/dev/null | grep -q . || { echo "No Processes Running"; exit 1; }
    shift
    mise x -- process-compose process logs -N default -f "$@"
    ;;
  restart)
    cleanup_services
    exec "$0" up
    ;;
  down)
    cleanup_services
    ;;
  *)
    echo "Usage: $0 [up|tui|ps|logs|restart|down]"
    exit 1
    ;;
esac
