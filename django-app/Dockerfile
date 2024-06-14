FROM python:3.10-slim-bullseye

WORKDIR /

RUN pip install --upgrade pip

COPY requirements.txt /

RUN pip install --no-cache-dir -r requirements.txt

COPY . /

ENTRYPOINT ["./scripts/entrypoint.sh"]

CMD ["python3", "manage.py", "runserver", "--noreload", "0.0.0.0:8000"]

EXPOSE 8000