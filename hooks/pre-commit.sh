#!/usr/bin/env bash


echo "Running pre-commit hook"
npm test -- --watchAll=false

if [ $? -ne 0 ]; then
 echo "=============================="
 echo "Tests must pass before commit!"
 echo "=============================="
 exit 1
fi