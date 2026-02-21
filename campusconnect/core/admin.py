from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import User, Room, Student, Complaint, Notice, Fee

admin.site.register(User)
admin.site.register(Room)
admin.site.register(Student)
admin.site.register(Complaint)
admin.site.register(Notice)
admin.site.register(Fee)