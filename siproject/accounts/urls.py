from django.urls import path, include
from .views import *
from rest_framework.routers import DefaultRouter
from .views import AnimalViewSet
from django.conf import settings
from django.conf.urls.static import static
from . import views
from django.urls import path
from .views import test_view
router = DefaultRouter()
router.register(r'animals', AnimalViewSet)
from .views import animal_list, animal_detail
from .views import LogoutView
from rest_framework_simplejwt.views import TokenBlacklistView

urlpatterns = [
    path('', home, name='home'),  # Route for the home page
    path('test/', test, name='test'),
    path('api/login/', LoginView.as_view(), name='login'),
    path('api/logout/', LogoutView.as_view(), name='logout'),
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/animals/create/', AnimalCreateView.as_view(), name='create-animal'),
    path('api/animals/create/', create_animal, name='create-animal-api'),
    path('api/animals/update/<str:name>/', update_animal, name='update-animal'),
    path('api/animals/delete/<str:name>/', delete_animal, name='delete-animal'),
    path('api/', include(router.urls)),
    path('api/test/', test_view),
    path('api/animalsc/', animal_list),  # URL to get all animals
    path('api/animalsc/<str:animal_type>/', animal_list),  # URL to filter animals by type
    path('api/animal/<str:name>/', animal_detail),  # URL to get animal details by name
    path('api/check-admin/', check_admin), # URL to check
]

# Serve static files during development (not needed in production)
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
