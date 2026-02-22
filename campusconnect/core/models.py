from django.db import models


class User(models.Model):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('student', 'Student'),
    )

    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    phone = models.CharField(max_length=15, blank=True, null=True)


class Room(models.Model):
    roomNo = models.CharField(max_length=10)
    capacity = models.IntegerField()
    occupied = models.IntegerField(default=0)


class Student(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE
    )
    room = models.ForeignKey(
        Room,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    roll_no = models.CharField(max_length=50)

class Complaint(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField()
    status = models.CharField(max_length=20, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)



class Notice(models.Model):
    CATEGORY_CHOICES = [
        ('maintenance', 'Maintenance'),
        ('event', 'Event'),
        ('rule', 'Rule Change'),
        ('other', 'Other'),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField()
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='other')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Fee(models.Model):
    student = models.ForeignKey(
        "Student",
        on_delete=models.CASCADE,
        related_name="fees"
    )
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, default="pending")
    due_date = models.DateField()
    semester = models.CharField(max_length=50)