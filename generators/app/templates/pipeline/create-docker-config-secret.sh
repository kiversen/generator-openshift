#!/bin/bash

# Generate a secret out of settings.xml
oc create secret generic <%= namespace %>-registry-config.json --from-file=registry-config.json -n <%= namespace %>
