# -*- coding:utf-8 -*-
import xadmin

__author__ = 'zhoujifeng'
__date__ = '2018/8/6 11:01'

from .models import Course, Lesson, CourseResource, Video


class CourseAdmin(object):
    list_display = ['name', 'desc', 'degree', 'learn_times', 'students', 'click_nums', 'add_time']
    search_fields = ['name', 'desc', 'degree', 'learn_times', 'students', 'click_nums']
    list_filter = ['name', 'desc', 'degree', 'learn_times', 'students', 'click_nums', 'add_time']


class LessonAdmin(object):
    list_display = ['course', 'name', 'add_time']
    search_fields = ['course', 'name']
    list_filter = ['course__name', 'name', 'add_time']


class VideoAdmin(object):
    list_display = ['lesson', 'name', 'add_time']
    search_fields = ['lesson', 'name']
    list_filter = ['lesson', 'name', 'add_time']


class CourseResourceAdmin(object):
    list_display = ['course', 'name', 'download', 'add_time']
    search_fields = ['course', 'name', 'download']
    list_filter = ['course__name', 'name', 'download', 'add_time']


xadmin.site.register(Course, CourseAdmin)
xadmin.site.register(Lesson, LessonAdmin)
xadmin.site.register(Video, VideoAdmin)
xadmin.site.register(CourseResource, CourseResourceAdmin)
