#!/bin/sh

python3 manage.py runserver --noreload 0.0.0.0:8000 
#&& python3 manage.py migrate;
