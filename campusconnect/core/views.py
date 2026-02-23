from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import F, Count, Sum
from django.http import HttpResponse
from django.conf import settings
from django.contrib.auth.hashers import make_password
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import Table, TableStyle
from reportlab.lib.utils import ImageReader
from .models import User, Room, Complaint, Fee, Student, Notice
import razorpay
import io
import os
from datetime import datetime, timezone


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

    rooms_with_students = Room.objects.annotate(
        student_count=Count('student')
    )

    available_rooms = rooms_with_students.filter(student_count__gt=0).count()

    occupied_rooms = total_rooms - available_rooms

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
def available_rooms(request):
    rooms = Room.objects.all()

    data = []

    for room in rooms:
        # print(room)
        occupied = Student.objects.filter(room=room).count()

        if occupied < room.capacity:
            data.append({
                "id": room.id,
                "room_no": room.roomNo,
                "capacity": room.capacity,
                "occupied": occupied
            })

    return Response(data)

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
        student = Student.objects.select_related("user").get(id=student_id)

        # Toggle User's active status
        student.user.is_active = not student.user.is_active
        student.user.save()

        return Response({
            "message": "Student status updated successfully",
            "is_active": student.user.is_active
        })

    except Student.DoesNotExist:
        return Response({"message": "Student not found"}, status=404)
@api_view(['POST'])
def create_student(request):

    try:
        name = request.data.get("name")
        email = request.data.get("email")
        password = request.data.get("password")
        roll_no = request.data.get("roll_no")
        phone = request.data.get("phone")
        room_no = request.data.get("room_no")

        if not all([name, email, password, roll_no]):
            return Response({"message": "Missing required fields"}, status=400)

        
        # Create user
        user = User.objects.create(
            name=name,
            email=email,
            password=password, 
            role="student",
            phone=phone,
            is_active=True
        )

        # Assign room
        room = None
        if room_no:
            room = Room.objects.filter(roomNo=room_no).first()

        # Create student profile
        Student.objects.create(
            user=user,
            roll_no=roll_no,
            room=room
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
            "semester": f.semester,
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

    student_id = request.data.get("student_id")
    amount = request.data.get("amount")
    semester = request.data.get("semester")
    due_date = request.data.get("due_date")

    if not student_id or not amount or not semester or not due_date:
        return Response({"message": "All fields required"}, status=400)

    try:
        student = Student.objects.get(id=student_id)
    except Student.DoesNotExist:
        return Response({"message": "Student not found"}, status=400)

    Fee.objects.create(
        student=student,   # ✅ correct
        amount=amount,
        semester=semester,
        status="pending",
        due_date=due_date
    )

    return Response({"message": "Fee created successfully"})

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
def delete_student(request, student_id):

    try:
        student = Student.objects.get(id=student_id)

        # This deletes both because of CASCADE
        student.user.delete()

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




@api_view(['POST'])
def create_payment_order(request, fee_id):

    try:
        fee = Fee.objects.get(id=fee_id)

        if fee.status == "paid":
            return Response({"message": "Already paid"}, status=400)

        client = razorpay.Client(
            auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
        )

        order = client.order.create({
            "amount": int(fee.amount * 100),  # paise
            "currency": "INR",
            "payment_capture": 1
        })

        return Response({
            "order_id": order["id"],
            "amount": order["amount"],
            "key": settings.RAZORPAY_KEY_ID
        })

    except Fee.DoesNotExist:
        return Response({"message": "Fee not found"}, status=404)
    

from django.utils import timezone

@api_view(['POST'])
def verify_payment(request):

    payment_id = request.data.get("payment_id")
    order_id = request.data.get("order_id")
    signature = request.data.get("signature")
    fee_id = request.data.get("fee_id")

    try:
        fee = Fee.objects.get(id=fee_id)

        client = razorpay.Client(
            auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
        )

        # Verify signature
        client.utility.verify_payment_signature({
            'razorpay_order_id': order_id,
            'razorpay_payment_id': payment_id,
            'razorpay_signature': signature
        })

        # SAVE PAYMENT DATA
        fee.status = "paid"
        fee.payment_id = payment_id
        fee.order_id = order_id
        fee.paid_at = timezone.now()
        fee.save()

        return Response({"message": "Payment successful"})

    except Fee.DoesNotExist:
        return Response({"message": "Fee not found"}, status=404)

    except razorpay.errors.SignatureVerificationError:
        return Response({"message": "Signature verification failed"}, status=400)

    except Exception as e:
        print(str(e))
        return Response({"message": "Verification failed"}, status=400)  
    



@api_view(['GET'])
def download_receipt(request, fee_id):

    from core.models import Fee

    fee = Fee.objects.get(id=fee_id)
   

    buffer = io.BytesIO()
    p = canvas.Canvas(buffer, pagesize=A4)

    width, height = A4

    # ================= HEADER SECTION =================
    header_height = 130

    # Background Header Bar
    p.setFillColor(colors.HexColor("#0A1F44"))  # Deep Blue
    p.rect(0, height - header_height, width, header_height, fill=1)

    # Logo (Left Side)
    logo_path = os.path.join(settings.BASE_DIR, "campusconnect", "logo", "lo.jpg")

    if os.path.exists(logo_path):
        logo = ImageReader(logo_path)
        p.drawImage(logo, 40, height - 90, width=50, height=50, mask='auto')

    # College Name & Address
    p.setFillColor(colors.white)

    p.setFont("Helvetica-Bold", 16)
    p.drawString(100, height - 60,
                 "Government Women's Polytechnic College Hostel | Kayamkulam")

    p.setFont("Helvetica", 11)
    p.drawString(100, height - 80,
                 "GWPC Hostel, Kayamkulam, Kerala - 690502")

    p.drawString(100, height - 95,
                 "+91 949675848")

    p.drawString(100, height - 110,
                 "hostel@gwpc.edu.in")

   

    # Divider Line
    p.setStrokeColor(colors.grey)
    p.line(50, height - 160, width - 50, height - 160)

    # ================= RECEIPT DETAILS =================
    receipt_data = [
        ["Receipt No", f"GWPC-REC-{fee.id}"],
        ["Student Name", fee.student.user.name],
        ["Semester", fee.semester],
        ["Amount Paid", f"Rs. {fee.amount}"],
        ["Payment Status", fee.status],
        ["Transaction ID", fee.payment_id if fee.payment_id else "N/A"],
        ["Payment Date", fee.paid_at.strftime("%d-%m-%Y %H:%M") if fee.paid_at else "N/A"]
    ]

    table = Table(receipt_data, colWidths=[150, 330])

    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.whitesmoke),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.lightgrey),
        ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 11),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
    ]))

    table.wrapOn(p, width, height)
    table.drawOn(p, 50, height - 350)

    # ================= FOOTER =================
    p.setFillColor(colors.HexColor("#0A1F44"))
    p.rect(0, 0, width, 45, fill=1)

    p.setFillColor(colors.white)
    p.setFont("Helvetica", 9)
    p.drawCentredString(width / 2, 18,
                        "This is a system-generated receipt from GWPC Hostel Management System.")

    p.showPage()
    p.save()

    buffer.seek(0)

    response = HttpResponse(buffer, content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="GWPC_Receipt_{fee.id}.pdf"'

    return response