from django.contrib import admin
from .models import App_User,Department,Service
# Register your models here.
admin.site.register(App_User)
admin.site.register(Department)
admin.site.register(Service)