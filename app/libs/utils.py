# -*- coding: utf-8 -*-

import os
import logging
from logging.handlers import RotatingFileHandler

DIR_LIBS = os.path.dirname(__file__)
DIR_APP = os.path.join(DIR_LIBS, '..')
DIR_STATIC = os.path.join(DIR_APP, 'static')
DIR_DATA = os.path.join(DIR_STATIC, 'data')
DIR_LOG = os.path.join(DIR_APP, 'log')

g_logger_dict = {}


def get_logger(name='base'):
    logfile = '{name}.log'.format(name=name)
    if name in g_logger_dict:
        return g_logger_dict[name]
    else:
        try:
            project_logger = None
            log_path = os.path.join(DIR_LOG, logfile)
            fh = RotatingFileHandler(log_path,
                                     maxBytes=100 * 1024 * 1024,
                                     backupCount=10)
            fh.setLevel(logging.INFO)
            formatter = logging.Formatter(
                '%(asctime)s - %(levelname)s - %(message)s')
            fh.setFormatter(formatter)
            project_logger = logging.getLogger(name)
            project_logger.addHandler(fh)
            project_logger.setLevel(logging.INFO)
            g_logger_dict[name] = project_logger
        except:
            print("Failed to get {} logger".format(name))
        finally:
            return project_logger


g_base_logger = get_logger('flask_base')

