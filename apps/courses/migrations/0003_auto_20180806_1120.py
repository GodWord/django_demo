# Generated by Django 2.0.5 on 2018-08-06 11:20

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('courses', '0002_auto_20180806_1110'),
    ]

    operations = [
        migrations.RenameField(
            model_name='video',
            old_name='course',
            new_name='lesson',
        ),
        migrations.AlterField(
            model_name='course',
            name='degree',
            field=models.CharField(choices=[('cj', '初级'), ('zj', '中级'), ('gj', '高级')], max_length=2, verbose_name='难度'),
        ),
    ]
