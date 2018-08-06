# -*- coding:utf-8 -*-
__author__ = 'zhoujifeng'
__date__ = '2018/8/6 11:37'

import xadmin
from .models import CityDict, CourseOrg, Teacher


class CityDictAdmin(object):
    list_display = ['name', 'desc', 'add_time']
    search_fields = ['name', 'desc']
    list_filter = ['name', 'desc', 'add_time']


class CourseOrgAdmin(object):
    list_display = ['name', 'city', 'click_num', 'desc', 'add_time']
    search_fields = ['name', 'city', 'click_num', 'desc']
    list_filter = ['name', 'city', 'click_num', 'desc', 'add_time']


class TeacherAdmin(object):
    list_display = ['name', 'org', 'work_company', 'work_years', 'work_position', 'points', 'add_time']
    search_fields = ['name', 'org', 'work_company', 'work_years', 'work_position', 'points']
    list_filter = ['name', 'org', 'work_company', 'work_years', 'work_position', 'points', 'add_time']


xadmin.site.register(CityDict, CityDictAdmin)
xadmin.site.register(CourseOrg, CourseOrgAdmin)
xadmin.site.register(Teacher, TeacherAdmin)
