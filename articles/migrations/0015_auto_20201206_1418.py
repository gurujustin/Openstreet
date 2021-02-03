# Generated by Django 3.1.4 on 2020-12-06 14:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('articles', '0014_auto_20201206_1410'),
    ]

    operations = [
        migrations.AlterField(
            model_name='finalcsv',
            name='buy_value',
            field=models.JSONField(default=2),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='finalcsv',
            name='sell_value',
            field=models.JSONField(),
        ),
        migrations.AlterField(
            model_name='finalcsv',
            name='top10_buys',
            field=models.JSONField(default=2),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='finalcsv',
            name='top10_inst',
            field=models.JSONField(default=2),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='finalcsv',
            name='top10_sells',
            field=models.JSONField(default=2),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='finalcsv',
            name='wealth_graph',
            field=models.JSONField(default=2),
            preserve_default=False,
        ),
    ]