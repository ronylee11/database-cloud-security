#!/bin/bash
sudo yum update -y
sudo yum install -y git
sudo yum install -y npm

cd /home/ec2-user
git clone -b mysql-migration https://github.com/ronylee11/database-cloud-security.git
cd database-cloud-security/backend
npm install