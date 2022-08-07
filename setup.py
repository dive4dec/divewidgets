#!/usr/bin/env python
# coding: utf-8

# Copyright (c) Chung Chan
# Distributed under the terms of the Modified BSD License.

import os
from os.path import join as pjoin
from setuptools import setup

HERE = os.path.dirname(os.path.abspath(__file__))
NAME = 'divewidgets'

try:
    from jupyter_packaging import (
        wrap_installers,
        npm_builder,
        get_version,
        get_data_files,
    )

    # Get the version
    version = get_version(pjoin(NAME, '_version.py'))

    # Representative files that should exist after a successful build
    jstargets = [
        pjoin(HERE, NAME, 'nbextension', 'index.js'),
        pjoin(HERE, NAME, 'labextension', 'package.json'),
    ]

    data_files_spec = [
        ('share/jupyter/nbextensions/divewidgets', 'divewidgets/nbextension', '**'),
        ('share/jupyter/labextensions/jupyter-divewidgets', 'divewidgets/labextension', '**'),
        ('share/jupyter/labextensions/jupyter-divewidgets', '.', 'install.json'),
        ('etc/jupyter/nbconfig/notebook.d', '.', 'divewidgets.json'),
    ]

    cmdclass = wrap_installers(
        post_develop=npm_builder(path=HERE, build_cmd='build:prod'), 
        ensured_targets=jstargets
    )

    setup_args = dict(
        version         = version,
        cmdclass        = cmdclass,
        data_files = get_data_files(data_files_spec),
    )

except ImportError:
    setup_args = {}

if __name__ == '__main__':
    setup(**setup_args)
