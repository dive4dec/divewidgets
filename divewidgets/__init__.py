#!/usr/bin/env python
# coding: utf-8

# Copyright (c) Chung Chan.
# Distributed under the terms of the Modified BSD License.
from .magic import DIVEMagics, OPTMagics
from .widget import JSWidget, create_JSXGraph, create_mermaid, create_flowchart, OPTWidget, create_optlite
from ._version import __version__, version_info

def load_ipython_extension(ipython):
    """
    Register the magics with a running IPython so the magics can be loaded via
     `%load_ext` or be configured to be autoloaded by IPython at startup time.
    """
    ipython.register_magics(DIVEMagics)
    ipython.register_magics(OPTMagics)

def _jupyter_labextension_paths():
    """Called by Jupyter Lab Server to detect if it is a valid labextension and
    to install the widget
    Returns
    =======
    src: Source directory name to copy files from. Webpack outputs generated files
        into this directory and Jupyter Lab copies from this directory during
        widget installation
    dest: Destination directory name to install widget files to. Jupyter Lab copies
        from `src` directory into <jupyter path>/labextensions/<dest> directory
        during widget installation
    """
    return [{
        'src': 'labextension',
        'dest': 'jupyter-divewidgets',
    }]


def _jupyter_nbextension_paths():
    """Called by Jupyter Notebook Server to detect if it is a valid nbextension and
    to install the widget
    Returns
    =======
    section: The section of the Jupyter Notebook Server to change.
        Must be 'notebook' for widget extensions
    src: Source directory name to copy files from. Webpack outputs generated files
        into this directory and Jupyter Notebook copies from this directory during
        widget installation
    dest: Destination directory name to install widget files to. Jupyter Notebook copies
        from `src` directory into <jupyter path>/nbextensions/<dest> directory
        during widget installation
    require: Path to importable AMD Javascript module inside the
        <jupyter path>/nbextensions/<dest> directory
    """
    return [{
        'section': 'notebook',
        'src': 'nbextension',
        'dest': 'divewidgets',
        'require': 'divewidgets/extension'
    }]
