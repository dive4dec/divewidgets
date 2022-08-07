#!/usr/bin/env python
# coding: utf-8

# Copyright (c) Chung Chan.
# Distributed under the terms of the Modified BSD License.

import pytest

from ..widget import JSXGraph


def test_example_creation_blank():
    w = JSXGraph()
    assert w.id == 'box'
