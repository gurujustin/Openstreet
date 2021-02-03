from django.contrib import admin

from .models import FinalCSV, Portfolio, PortfolioStats, TDState

admin.site.register(FinalCSV)
admin.site.register(Portfolio)
admin.site.register(PortfolioStats)
admin.site.register(TDState)