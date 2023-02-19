#!/bin/bash

# prompt for OPENAI_KEY. if empty keep prompting
while [ -z "$OPENAI_KEY" ]
do    
    read -s -r -e -p "Enter your openai_key: " OPENAI_KEY
done

# create .env from variables set in this file
cat > .env << EOF
OPENAI_KEY=$OPENAI_KEY
EOF