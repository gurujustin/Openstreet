# Generated by Django 3.1.4 on 2020-12-26 12:52

from django.db import migrations
import jsonfield.fields


class Migration(migrations.Migration):

    dependencies = [
        ('articles', '0047_auto_20201226_0203'),
    ]

    operations = [
        migrations.AddField(
            model_name='portfoliostats',
            name='execute_portfolio',
            field=jsonfield.fields.JSONField(null=True),
        ),
    ]
