#!/bin/bash

# Grant cluster access to service account for building images
oc adm policy add-scc-to-user anyuid -z <%= serviceaccountname %>
# Revoke cluster access to service account for building images
# oc adm policy remove-scc-from-user anyuid -z <%= serviceaccountname %>