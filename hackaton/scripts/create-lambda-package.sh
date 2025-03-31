#!/bin/bash

# Create a temporary directory
mkdir -p lambda-package

# Copy only the necessary files
cp ../lambda/index.js lambda-package/
cp ../lambda/package.json lambda-package/

# Install dependencies in the package directory
cd lambda-package
npm install --production

# Create the zip file
zip -r ../function.zip .

# Clean up
cd ..
rm -rf lambda-package

echo "Lambda package created successfully!" 