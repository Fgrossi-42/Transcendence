FROM python:3.10-slim-bullseye

WORKDIR /app/

RUN pip install --upgrade pip

COPY requirements.txt /app/

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8000

CMD ["python3", "manage.py", "runserver", "0.0.0.0:8000"]

# COPY . /app/

# CMD ["python3", "manage.py", "runserver", "--noreload", "0.0.0.0:8000"]
