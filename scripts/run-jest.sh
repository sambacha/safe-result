#!/usr/bin/env bash

set -o errexit
# Get directory of calling script
DIR="$( cd "$( dirname "$0" )" &> /dev/null && pwd )"

# DIR="$(cd "$(dirname "$0")" && pwd -P)"
if [ "$(echo $DIR | grep '.nvm')" ]; then
    DIR="$(dirname "$(readlink -f "$0")")"
fi 
/usr/bin/env node --expose-gc  --experimental-specifier-resolution=node $DIR/node_modules/.bin/jest --coverage --globals "{\"coverage\":true}" "$@"
sleep 1
echo "Process script terminated"
