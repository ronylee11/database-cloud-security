FROM node:22@sha256:fa54405993eaa6bab6b6e460f5f3e945a2e2f07942ba31c0e297a7d9c2041f62

WORKDIR /var/www

RUN git clone https://github.com/ronylee11/database-cloud-security.git .

WORKDIR /var/www/frontend
RUN ls -la

# Install then build
RUN npm ci
RUN npm run build

# Expose
EXPOSE 80

# "Do not use this as a production server as it's not designed for it" -the docs 
# for the purpose of this assignment, we'll just do this instead
CMD ["npm", "run", "preview", "--host"]