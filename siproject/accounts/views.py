from django.shortcuts import render
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from rest_framework import serializers, viewsets, generics
from .models import Animal
from rest_framework.decorators import api_view
from .serializers import AnimalSerializer
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView


#admin 
@api_view(['GET'])
def check_admin(request):
    user = request.user
    return Response({'is_admin': user.is_staff})
#user login authentication
@login_required
def animal_list(request):
    # ตัวอย่างฟังก์ชันในการส่งข้อมูลสัตว์
    animals = Animal.objects.all().values('name', 'scientific_name', 'photo')
    return JsonResponse(list(animals), safe=False)

def test_view(request):
    return JsonResponse({"message": "CORS Test Successful!"})

def test(request):
    return HttpResponse("message")

def home(request):
    return render(request, 'home.html')

class LoginView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(username=username, password=password)

        if user is not None:
            # ใช้ SimpleJWT เพื่อสร้าง access token และ refresh token
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'access_token': str(refresh.access_token),  # ส่ง access token ไปยัง frontend
                'refresh_token': str(refresh),  # ส่ง refresh token ไปยัง frontend
            }, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh_token")
            if not refresh_token:
                return Response({"error": "Refresh token is required"}, status=status.HTTP_400_BAD_REQUEST)

            token = RefreshToken(refresh_token)
            token.blacklist()  # Blacklist the refresh token
            return Response({"message": "Logout successful"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        
class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'password')

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class RegisterView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AnimalViewSet(viewsets.ModelViewSet):
    queryset = Animal.objects.all()
    serializer_class = AnimalSerializer

class AnimalCreateView(generics.CreateAPIView):
    queryset = Animal.objects.all()
    serializer_class = AnimalSerializer


# View to get all animals or filter animals based on type
@api_view(['GET'])
def animal_list(request, animal_type=None):
    if animal_type:
        animals = Animal.objects.filter(category=animal_type)
    else:
        animals = Animal.objects.all()
    serializer = AnimalSerializer(animals, many=True)
    return Response(serializer.data)

# View to get animal details by name
@api_view(['GET'])
def animal_detail(request, name):
    animal = get_object_or_404(Animal, name=name)
    serializer = AnimalSerializer(animal)
    return Response(serializer.data)


@api_view(['POST'])
def create_animal(request):
    serializer = AnimalSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
def update_animal(request, name):
    try:
        animal = Animal.objects.get(name=name)
    except Animal.DoesNotExist:
        return Response({'error': 'Animal not found'}, status=status.HTTP_404_NOT_FOUND)

    serializer = AnimalSerializer(animal, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def delete_animal(request, name):
    try:
        animal = Animal.objects.get(name=name)
    except Animal.DoesNotExist:
        return Response({'error': 'Animal not found'}, status=status.HTTP_404_NOT_FOUND)

    animal.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)
