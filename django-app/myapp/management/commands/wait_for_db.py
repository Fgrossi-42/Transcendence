import django
import time
import os
from django.core.management.base import BaseCommand
from django.db import connections
from django.db.utils import OperationalError

class Command(BaseCommand):
    """Django command to pause execution until database is available"""

# In settings.py
DATABASE_READY = False

# At startup
while not DATABASE_READY:
  try:
    django.db.connections['default'].ensure_connection()
  except Exception:
    time.sleep(1)
  else:
    DATABASE_READY = True

# Run migrations now
if not DATABASE_READY:
  print('Applying migrations...')
  os.system('python manage.py migrate')