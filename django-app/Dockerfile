FROM python:3.10-slim-bullseye

WORKDIR /app/

RUN pip install --upgrade pip

COPY requirements.txt /app/

RUN pip install --no-cache-dir -r requirements.txt

COPY . /app/

# RUN python3 manage.py makemigrations

ENTRYPOINT ["./scripts/entrypoint.sh"]

CMD ["sh", "-c", "./scripts/script.sh"]

EXPOSE 8000