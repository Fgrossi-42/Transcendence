FROM python:3.10-slim-bullseye

WORKDIR /app/

RUN pip install --upgrade pip

COPY requirements.txt /app/

RUN pip install --no-cache-dir -r requirements.txt

COPY . /app/

RUN python3 manage.py makemigrations

EXPOSE 8000

CMD ["sh -c", "./script.sh"]



# RUN python3 manage.py migrate