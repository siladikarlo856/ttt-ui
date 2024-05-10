NAME="ttt-ui"
BUILD_MODE="${1:-production}"

# Build the Docker image
docker build -t "$NAME:latest-$BUILD_MODE" \
  -f docker/Dockerfile .


# Check if the Docker build was successful
if [ $? -eq 0 ]; then
  echo "Docker image $NAME:$VERSION-$BUILD_MODE built successfully and tagged as latest."
else
  echo "Error: Docker image build failed."
  exit 1
fi