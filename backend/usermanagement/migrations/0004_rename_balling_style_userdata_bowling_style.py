# Generated by Django 5.0.1 on 2024-04-02 03:43

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('usermanagement', '0003_alter_userdata_player_id'),
    ]

    operations = [
        migrations.RenameField(
            model_name='userdata',
            old_name='balling_style',
            new_name='bowling_style',
        ),
    ]