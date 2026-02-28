from django.db import models



# <-------------User Model------------->

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
    is_active = models.BooleanField(default=True)


# <-------------Room Model------------->


class Room(models.Model):
    roomNo = models.CharField(max_length=10)
    capacity = models.IntegerField()
    occupied = models.IntegerField(default=0)


# <-------------Student Model------------->

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



# <-------------Complaint Model------------->

class Complaint(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField()
    status = models.CharField(max_length=20, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)




# <-------------Notice Model------------->

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
    


# <-------------Fee Model------------->    

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
    payment_id = models.CharField(max_length=200, null=True, blank=True)
    order_id = models.CharField(max_length=200, null=True, blank=True)
    paid_at = models.DateTimeField(null=True, blank=True)