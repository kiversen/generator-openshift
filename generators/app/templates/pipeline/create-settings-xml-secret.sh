#!/bin/bash

# Generate a secret out of settings.xml
oc create secret generic <%= namespace %>-maven-settings.xml --from-file=settings.xml -n <%= namespace %>