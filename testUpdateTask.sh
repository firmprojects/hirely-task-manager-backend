#!/bin/bash

curl -X PUT http://localhost:3000/api/tasks/1/update \
-H "Content-Type: application/json" \
-H "Authorization: Bearer YOUR_TOKEN" \
-d '{"title": "Updated Task Title", "description": "Updated Task Description"}'
