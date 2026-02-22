from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import F, Sum
from .models import User, Room, Complaint, Fee, Student


# ---------------- LOGIN ----------------
@api_view(['POST'])
def login_view(request):
    email = request.data.get("email")
    password = request.data.get("password")

    try:
        user = User.objects.get(email=email, password=password)
        return Response({
            "role": user.role,
            "user_id": user.id,
            "username": user.name
        })
    except User.DoesNotExist:
        return Response({"message": "Invalid credentials"}, status=401)


# ---------------- ADMIN DASHBOARD ----------------
@api_view(['GET'])
def admin_dashboard(request):

    total_students = Student.objects.count()

    total_rooms = Room.objects.count()

    occupied_rooms = Room.objects.filter(
        occupied__gt=0
    ).count()

    available_rooms = Room.objects.filter(
        occupied__lt=F('capacity')
    ).count()

    pending_complaints = Complaint.objects.filter(
        status='pending'
    ).count()

    resolved_complaints = Complaint.objects.filter(
        status='resolved'
    ).count()

    pending_fees = Fee.objects.filter(
        status='pending'
    ).aggregate(total=Sum('amount'))['total'] or 0

    return Response({
        "total_students": total_students,
        "total_rooms": total_rooms,
        "occupied_rooms": occupied_rooms,
        "available_rooms": available_rooms,
        "pending_complaints": pending_complaints,
        "resolved_complaints": resolved_complaints,
        "pending_fees": pending_fees
    })

@api_view(['GET'])
def list_students(request):

    students = Student.objects.select_related('user', 'room')

    data = []

    for s in students:
        data.append({
            "id": s.id,
            "name": s.user.name,
            "email": s.user.email,
            "roll_no": s.roll_no,
            "phone": s.user.phone if hasattr(s.user, "phone") else None,
            "room_no": s.room.roomNo if s.room else None,
            "is_active": s.user.is_active if hasattr(s.user, "is_active") else True   # ← Added this
        })

    return Response(data)



@api_view(['DELETE'])
def delete_student(request, student_id):
    try:
        student = Student.objects.get(id=student_id)
        student.delete()
        return Response({"message": "Student deleted successfully"})
    except Student.DoesNotExist:
        return Response({"message": "Student not found"}, status=404)
    

@api_view(['PUT'])
def toggle_student_status(request, student_id):
    try:
        student = Student.objects.get(id=student_id)
        student.is_active = not student.is_active
        student.save()
        return Response({"message": "Status updated"})
    except Student.DoesNotExist:
        return Response({"message": "Student not found"}, status=404)

@api_view(['POST'])
def create_student(request):
    try:
        name = request.data.get("name")
        email = request.data.get("email")
        roll_no = request.data.get("roll_no")
        phone = request.data.get("phone")
        room_no = request.data.get("room_no")

        if not name or not email or not roll_no or not phone:
            return Response({"message": "All required fields must be filled"}, status=400)

        # Prevent duplicate email
        if User.objects.filter(email=email).exists():
            return Response({"message": "Email already exists"}, status=400)

        user = User.objects.create(
            name=name,
            email=email,
            password="1234",
            role="student"
        )

        room = Room.objects.filter(roomNo=room_no).first() if room_no else None

        Student.objects.create(
            user=user,
            rollNo=roll_no,
            phone=phone,
            dept="N/A",
            year=1,
            room=room,
            is_active=True
        )

        return Response({"message": "Student created successfully"})

    except Exception as e:
        return Response({"message": str(e)}, status=400)
    




# @api_view(['GET'])
# def list_rooms(request):

#     rooms = Room.objects.all()
#     data = []

#     for r in rooms:
#         occupied = Student.objects.filter(room=r).count()

#         data.append({
#             "id": r.id,
#             "room_no": r.roomNo,
#             "block": r.block,
#             "floor": r.floor,
#             "capacity": r.capacity,
#             "occupied": occupied
#         })

#     return Response(data)

@api_view(['POST'])
def create_room(request):

    room_no = request.data.get("room_no")
    capacity = request.data.get("capacity")

    if not room_no or not capacity:
        return Response({"message": "Room number and capacity required"}, status=400)

    if Room.objects.filter(roomNo=room_no).exists():
        return Response({"message": "Room already exists"}, status=400)

    Room.objects.create(
        roomNo=room_no,
        capacity=capacity
    )

    return Response({"message": "Room created successfully"})

@api_view(['PUT'])
def update_room(request, room_id):

    capacity = request.data.get("capacity")

    if not capacity:
        return Response({"message": "Capacity required"}, status=400)

    try:
        room = Room.objects.get(id=room_id)

        # Prevent reducing capacity below occupied students
        occupied = Student.objects.filter(room=room).count()

        if int(capacity) < occupied:
            return Response({
                "message": f"Cannot reduce below occupied count ({occupied})"
            }, status=400)

        room.capacity = capacity
        room.save()

        return Response({"message": "Room updated"})

    except Room.DoesNotExist:
        return Response({"message": "Room not found"}, status=404)
@api_view(['PUT'])
def unassign_student(request, student_id):

    try:
        student = Student.objects.get(id=student_id)
        student.room = None
        student.save()
        return Response({"message": "Student unassigned"})
    except Student.DoesNotExist:
        return Response({"message": "Student not found"}, status=404)
    
@api_view(['GET'])
def list_rooms(request):

    rooms = Room.objects.all()
    data = []

    for r in rooms:

        students = Student.objects.filter(room=r)

        student_list = []
        for s in students:
            student_list.append({
                "id": s.id,
                "name": s.user.name,
                "roll_no": s.roll_no
            })

        data.append({
            "id": r.id,
            "room_no": r.roomNo,
            "capacity": r.capacity,
            "occupied": students.count(),
            "students": student_list
        })

    return Response(data)


from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Notice


# ================= LIST ALL NOTICES =================
@api_view(['GET'])
def list_notices(request):
    notices = Notice.objects.all().order_by('-created_at')

    data = []
    for n in notices:
        data.append({
            "id": n.id,
            "title": n.title,
            "description": n.description,
            "category": n.category,
            "created_at": n.created_at,
        })

    return Response(data)


# ================= CREATE NOTICE =================
@api_view(['POST'])
def create_notice(request):
    title = request.data.get('title')
    description = request.data.get('description')
    category = request.data.get('category', 'other')

    if not title or not description:
        return Response({"message": "Title and Description required"}, status=400)

    notice = Notice.objects.create(
        title=title,
        description=description,
        category=category
    )

    return Response({
        "message": "Notice created successfully",
        "id": notice.id
    })


# ================= DELETE NOTICE =================
@api_view(['DELETE'])
def delete_notice(request, notice_id):
    try:
        notice = Notice.objects.get(id=notice_id)
        notice.delete()
        return Response({"message": "Notice deleted successfully"})
    except Notice.DoesNotExist:
        return Response({"message": "Notice not found"}, status=404)
    

@api_view(['PUT'])
def update_complaint_status(request, complaint_id):
    try:
        complaint = Complaint.objects.get(id=complaint_id)
        new_status = request.data.get("status")

        if new_status not in ["pending", "in-progress", "resolved"]:
            return Response({"message": "Invalid status"}, status=400)

        complaint.status = new_status
        complaint.save()

        return Response({"message": "Status updated successfully"})
    except Complaint.DoesNotExist:
        return Response({"message": "Complaint not found"}, status=404)    
    

@api_view(['GET'])
def list_complaints(request):

    complaints = Complaint.objects.all().order_by('-created_at')

    data = []
    for c in complaints:
        data.append({
            "id": c.id,
            "title": c.title,
            "description": c.description,
            "status": c.status,
            "created_at": c.created_at.isoformat(),
            "student_name": c.student.name  # adjust if different
        })

    return Response(data)    


# ---------------- LIST FEES ----------------
@api_view(['GET'])
def list_fees(request):

    fees = Fee.objects.select_related('student').all()

    data = []

    for f in fees:
        data.append({
            "id": f.id,
            "student_name": f.student.user.name if f.student else "N/A",
            "roll_no": "N/A",  # you don't store roll number in User
            "amount": float(f.amount),
            "status": f.status,
            "due_date": f.due_date.isoformat() if f.due_date else None
        })

    return Response(data)


# ---------------- MARK AS PAID ----------------
@api_view(['PUT'])
def mark_fee_paid(request, fee_id):

    try:
        fee = Fee.objects.get(id=fee_id)
        fee.status = "paid"
        fee.save()

        return Response({"message": "Marked as paid"})
    except Fee.DoesNotExist:
        return Response({"message": "Fee not found"}, status=404)
    


@api_view(['PUT'])
def update_fee(request, fee_id):

    try:
        fee = Fee.objects.get(id=fee_id)

        amount = request.data.get("amount")
        status = request.data.get("status")

        if amount is not None:
            fee.amount = amount

        if status is not None:
            fee.status = status

        fee.save()

        return Response({"message": "Fee updated successfully"})

    except Fee.DoesNotExist:
        return Response({"message": "Fee not found"}, status=404)    
    
@api_view(['POST'])
def create_fee(request):

    try:
        student_id = request.data.get("student_id")
        amount = request.data.get("amount")
        due_date = request.data.get("due_date")

        if not student_id or not amount or not due_date:
            return Response({"message": "All fields required"}, status=400)

        student = User.objects.get(id=student_id, role="student")

        fee = Fee.objects.create(
            student=student,
            amount=amount,
            status="pending",
            due_date=due_date
            
        )

        return Response({"message": "Fee created successfully"})

    except User.DoesNotExist:
        return Response({"message": "Student not found"}, status=404)   
    
@api_view(['GET'])
def student_dashboard(request, user_id):

    try:
        # Get user
        user = User.objects.get(id=user_id, role="student")

        # Get student record
        student = Student.objects.filter(user=user).first()

        # Get room
        room = student.room if student else None

        # Calculate occupancy AFTER room is defined
        if room:
            occupied_count = Student.objects.filter(room=room).count()
        else:
            occupied_count = 0

        # Get fees
        student = Student.objects.filter(user=user).first()

        fees = Fee.objects.filter(student=student) if student else []
        total_amount = sum([float(f.amount) for f in fees])
        pending_amount = sum([float(f.amount) for f in fees if f.status == "pending"])

        return Response({
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "total_fees": total_amount,
            "pending_fees": pending_amount,
            "fees_paid": pending_amount == 0,

            "room_no": room.roomNo if room else None,   # use correct field name
            "room_capacity": room.capacity if room else None,
            "room_occupied": occupied_count
        })

    except User.DoesNotExist:
        return Response({"message": "Student not found"}, status=404)

@api_view(['GET'])
def latest_complaint(request):

    user_id = request.GET.get('user_id')

    if not user_id:
        return Response({"message": "User ID required"}, status=400)

    complaint = Complaint.objects.filter(student_id=user_id)\
                                  .order_by('-created_at')\
                                  .first()

    if not complaint:
        return Response({})

    return Response({
        "id": complaint.id,
        "title": complaint.title,
        "description": complaint.description,
        "status": complaint.status,
        "created_at": complaint.created_at
    })


@api_view(['GET'])
def latest_notice(request):

    notice = Notice.objects.order_by('-created_at').first()

    if not notice:
        return Response({})

    return Response({
        "id": notice.id,
        "title": notice.title,
        "description": notice.description,
        "category": notice.category,
        "created_at": notice.created_at
    })

@api_view(['GET'])
def student_fees(request, user_id):

    student = Student.objects.filter(user_id=user_id).first()
    if not student:
        return Response([])

    fees = Fee.objects.filter(student=student)

    data = [{
        "id": f.id,
        "amount": float(f.amount),
        "status": f.status,
        "due_date": f.due_date,
        "semester": f.semester
    } for f in fees]

    return Response(data)

@api_view(['DELETE'])
def delete_student(request, id):

    try:
        student = Student.objects.get(id=id)
        user = student.user

        student.delete()   # deletes student + fees (cascade)
        user.delete()      # deletes user

        return Response({"message": "Student deleted successfully"})

    except Student.DoesNotExist:
        return Response({"message": "Student not found"}, status=404)
    
@api_view(['GET'])
def student_complaints(request, user_id):

    complaints = Complaint.objects.filter(student_id=user_id).order_by('-created_at')

    data = [{
        "id": c.id,
        "title": c.title,
        "description": c.description,
        "status": c.status,
        "created_at": c.created_at
    } for c in complaints]

    return Response(data)

@api_view(['POST'])
def create_complaint(request):

    user_id = request.data.get("user_id")

    try:
        user = User.objects.get(id=user_id, role="student")
    except User.DoesNotExist:
        return Response({"message": "Student not found"}, status=404)

    complaint = Complaint.objects.create(
        student=user,
        title=request.data.get("title"),
        description=request.data.get("description"),
        status="pending"
    )

    return Response({"message": "Complaint created successfully"})