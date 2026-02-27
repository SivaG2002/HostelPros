from django.contrib import admin
from django.urls import path, include
from core import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.index),
    path('login/', views.login_page),
    
    # Admin Dashboard & Pages
    path('dashboard/admin_dashboard/', views.admin_dashboard_page),
    path('dashboard/admin_dashboard/students.html', views.students_page),
    path('dashboard/admin_dashboard/rooms.html', views.rooms_page),
    path('dashboard/admin_dashboard/complaints.html', views.complaints_page),
    path('dashboard/admin_dashboard/notices.html', views.notices_page),
    path('dashboard/admin_dashboard/fees.html', views.fees_page),
    
    # Student Dashboard & Pages
    path('student/dashboard/<int:user_id>/', views.student_dashboard_page),
    path('student/dashboard/<int:user_id>/complaints.html', views.student_complaints_page),
    path('student/dashboard/<int:user_id>/notices.html', views.student_notices_page),
    path('student/dashboard/<int:user_id>/fees.html', views.student_fees_page),
    path('student/dashboard/<int:user_id>/rules.html', views.student_rules_page),
    
    # API Routes
    path('api/', include('core.urls')),
]