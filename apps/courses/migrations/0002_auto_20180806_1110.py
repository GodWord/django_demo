# Generated by Django 2.0.5 on 2018-08-06 11:10

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('courses', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='course',
            name='click_nums',
            field=models.IntegerField(default=0, verbose_name='点击数'),
        ),
    ]