#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import os
import sys

file_dir = os.path.split(sys.argv[1])[0]
if not os.path.isdir(file_dir):
    os.makedirs(file_dir)

f = open(sys.argv[1],'a')

f.write(os.linesep)
f.write('VUE_APP_VERSION = ' + os.environ['version'])
#f.write(os.linesep)
#f.write('VUE_APP_COMMITID = '  + os.environ['commitId'])
#f.write(os.linesep)
#f.write('VUE_APP_COMMITIDMSG = '  + os.environ['commitMessage'])

