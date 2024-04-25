FROM python:3.10-slim-bullseye

WORKDIR /app/

RUN pip install --upgrade pip

COPY requirements.txt /app/

RUN pip install -r requirements.txt

COPY . /app/

EXPOSE 8000

CMD ["python3", "manage.py", "runserver", "--noreload", "0.0.0.0:8000"]
