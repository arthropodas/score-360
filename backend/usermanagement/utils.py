from django.conf import settings
import jwt
from datetime import timedelta, datetime
from django.core.mail import EmailMultiAlternatives
from django.template.loader import get_template
from rest_framework.response import Response
from django.core.exceptions import ValidationError


def send_email(mail,subject,template,url,data=None):
    print(mail)
    final_url=settings.BASE_URL+url
    link_to_send={'url':final_url}
    if  data is not None:
        context={**link_to_send,**data}
    else:
        context={**link_to_send}
    from_email=f'<{settings.EMAIL_HOST}>'
    html=get_template(template)
    html_content=html.render(context)
    msg=EmailMultiAlternatives(subject,"",from_email,[mail])
    msg.attach_alternative(html_content,"text/html")
    msg.send()



def generate_token(email):
    expiration_time = datetime.utcnow() + timedelta(minutes=15)
    payload_data = {
    'email': email,
    'expiry': expiration_time.timestamp(),  
}
    token = jwt.encode(payload_data,settings.SECRET_KEY ,algorithm='HS256')
    return token


