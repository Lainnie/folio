from django.conf.urls import patterns, include, url

urlpatterns = patterns('listen.views',
    url(r'^$', 'index', name='index'),
)
