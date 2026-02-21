from django.urls import path
from . import views

urlpatterns = [
    path('login/login/', views.login_view),
    path('dashboard/admin_dashboard/', views.admin_dashboard),
    path('students/list_all/', views.list_students),
    path('students/delete/<int:student_id>/', views.delete_student),
    path('students/toggle/<int:student_id>/', views.toggle_student_status),
    path('students/create/', views.create_student),
    path('rooms/create/', views.create_room),
    path('rooms/', views.list_rooms),
    path('rooms/update/<int:room_id>/', views.update_room),
    path('students/unassign/<int:student_id>/', views.unassign_student),
    path('notices/', views.list_notices),
    path('notices/create/', views.create_notice),
    path('notices/delete/<int:notice_id>/', views.delete_notice),
    path('complaints/update/<int:complaint_id>/', views.update_complaint_status),
    path('complaints/', views.list_complaints),
    path('fees/', views.list_fees),
    path('fees/mark_paid/<int:fee_id>/', views.mark_fee_paid),  
    path('fees/update/<int:fee_id>/', views.update_fee),
    path('fees/create/', views.create_fee),
]