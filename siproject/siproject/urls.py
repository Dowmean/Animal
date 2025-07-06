from django.contrib import admin, admindocs 
from django.urls import path, include  # นำเข้า include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenBlacklistView  # นำเข้า TokenBlacklistView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('accounts.urls')),  
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/logout/', TokenBlacklistView.as_view(), name='token_blacklist'),  # เพิ่มการเรียกใช้งาน TokenBlacklistView
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
