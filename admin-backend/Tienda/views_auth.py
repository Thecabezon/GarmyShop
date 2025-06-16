from django.contrib.auth import authenticate, login, logout
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        return Response({'detail': 'Logged in'})
    return Response({'detail': 'Invalid credentials'}, status=400)

@api_view(['POST'])
def logout_view(request):
    logout(request)
    return Response({'detail': 'Logged out'})

@api_view(['GET'])
def user_view(request):
    if request.user.is_authenticated:
        return Response({'username': request.user.username})
    return Response({'detail': 'Not authenticated'}, status=401)