#!/bin/bash
echo "Building Spring Boot Maven Backend..."
cd backend && mvn clean package -DskipTests=false
cd ..
echo "Building React Frontend..."
npm run build
echo "Build complete!"
