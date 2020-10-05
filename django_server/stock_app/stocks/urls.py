from django.urls import path, re_path

from django.views.decorators.csrf import csrf_exempt
from django.views.generic.base import TemplateView

from graphene_django.views import GraphQLView
from stock_app.schema import schema



from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('graphql/', csrf_exempt(GraphQLView.as_view(graphiql=True, schema=schema))),
    re_path(r'^.*$', views.index, name='index')
]