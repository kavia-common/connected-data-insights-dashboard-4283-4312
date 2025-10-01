#!/bin/bash
cd /home/kavia/workspace/code-generation/connected-data-insights-dashboard-4283-4312/dashboard_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

