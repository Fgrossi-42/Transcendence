# import django
# import time
# import os
# from django.core.management.base import BaseCommand
# from django.db import connections
# from django.db.utils import OperationalError

# class Command(BaseCommand):
#     """Django command to pause execution until database is available"""
# DATABASE_READY = False

# def handle():
#   while not DATABASE_READY:
#     try:
#       django.db.connections['default'].ensure_connection()
#     except Exception:
#       print('Waiting for db...')
#       time.sleep(1)
#     else:
#       DATABASE_READY = True

#   if not DATABASE_READY:
#     print('Applying migrations...')
#     os.system('python manage.py migrate')


from django.core.management.base import BaseCommand
from django.db import connections
from django.db.utils import OperationalError
import time
import django


class Command(BaseCommand):
    """ Django command to pause execution until database is available"""
    def handle(self, *args, **kwargs):
        self.stdout.write('waiting for db ...')
        db_conn = False
        while not db_conn:
            try:
                # get the database with keyword 'default' from settings.py
                # db_conn = connections['default']
                self.check(databases=['default'])
                db_conn = True
                # django.db.connections['default'].ensure_connection()
                # prints success messge in green
                self.stdout.write(self.style.SUCCESS('db available'))
            except Exception:
                self.stdout.write("Database unavailable, waiting 1 second ...")
                time.sleep(1)