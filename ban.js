
services:
  - type: worker
    name: limaris-bot
    env: node
    plan: free
    buildCommand: npm install
    startCommand: npm start
    autoDeploy: true
