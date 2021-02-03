from articles.api.views import FinalCSVViewSet, PortfolioViewSet, UserViewSet, PortfolioStatsViewSet
from rest_framework.routers import DefaultRouter
from django.urls import path

router = DefaultRouter()
router.register(r'matrix', FinalCSVViewSet, basename='matrix')
router.register(r'portfolio', PortfolioViewSet, basename='portfolios')
router.register(r'user', UserViewSet, basename='users')
router.register(r'portfoliostats', PortfolioStatsViewSet, basename='portfoliostats')
urlpatterns = router.urls