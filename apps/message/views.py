from django.shortcuts import render
from .models import UserMessage


# Create your views here.
def getform(request):
    all_message = UserMessage.objects.filter(address='上海')
    if all_message is not None:
        message = all_message[0]

        # if request.method == 'POST':
    #     name = request.POST.get('name', '')
    #     email = request.POST.get('email', '')
    #     address = request.POST.get('address', '')
    #     message = request.POST.get('message', '')
    #     user_message = UserMessage()
    #     user_message.name = name
    #     user_message.email = email
    #     user_message.address = address
    #     user_message.message = message
    #     user_message.save()
    return render(request, 'massage_form.html', {
        'my_message': message
    })
