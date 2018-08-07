from django.contrib import auth
from django.contrib.auth import authenticate
from django.http import HttpResponse
from django.shortcuts import render


# Create your views here.


def login(request):
    if request.method == 'POST':

        print('post......................................................................')
        user_name = request.POST.get('username', '')
        pass_word = request.POST.get('password', '')
        user = authenticate(username=user_name, password=pass_word)
        if user is not None:
            print('logging......................................................................')
            auth.login(request, user)
        return render(request, 'index.html')
    elif request.method == 'GET':

        return render(request, 'login.html', {})


def ana(request):
    if request.method == 'GET':
        id = request.GET.get('id', default='110')
        name = request.GET.get('name', default='')
        sex = request.GET.get('sex', default='保密')

    return HttpResponse('', content_type="image/png")
