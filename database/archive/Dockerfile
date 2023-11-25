# Use the official MariaDB image as the base image
FROM mariadb:latest

# Create the directory for init scripts
RUN mkdir -p /docker-entrypoint-initdb.d

# Copy all SQL files from the local directory into the init script directory
COPY ./*.sql /docker-entrypoint-initdb.d/

# Set the working directory to /docker-entrypoint-initdb.d
WORKDIR /docker-entrypoint-initdb.d

# Run any commands you need during the build process (if necessary)

# Start the MySQL service when the container starts
CMD ["mysqld"]