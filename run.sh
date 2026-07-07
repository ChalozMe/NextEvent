#!/bin/bash

set -a
source .env
set +a

cd backend
mvn spring-boot:run
