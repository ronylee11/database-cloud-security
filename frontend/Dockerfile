FROM node:22@sha256:fa54405993eaa6bab6b6e460f5f3e945a2e2f07942ba31c0e297a7d9c2041f62

WORKDIR /var/www/frontend

# copy files from current directory (frontend repo) to container
COPY . /var/www/frontend/

# Install then build
RUN npm ci
RUN npm run build

# Expose
EXPOSE 80

# "Do not use preview as a production server as it's not designed for it" -the docs 
# for the purpose of this assignment, we'll just use it anyways (i am not configuring a nginx file)
CMD ["npm", "run", "preview"]