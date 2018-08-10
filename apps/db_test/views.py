from django.http import HttpResponse
from django.shortcuts import render

# Create your views here.
from apps.db_test import models


def test(request):
    if request.method == 'GET':
        # username = request.GET.get('name', default='')
        # age = request.GET.get('sex', default='保密')

        user_dict = {"username": request.GET.get('username', default=''), "age": request.GET.get('age', default='保密')}
        models.UserInfo.objects.create(**user_dict)

    return HttpResponse('', content_type="image/png")
