from django.db import models


# Create your models here.

class UserInfo(models.Model):
    username = models.CharField(max_length=32, verbose_name='用户名称')
    age = models.IntegerField(verbose_name='年龄')

    class Meta:
        verbose_name = '用户信息'
        verbose_name_plural = verbose_name

    def __unicode__(self):
        return self.username
