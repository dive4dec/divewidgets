// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

// Add any needed widget imports here (or from controls)
// import {} from '@jupyter-widgets/base';

import { createTestModel } from './utils';

import { JSWidgetModel } from '..';

describe('JSWidget', () => {
  describe('JSWidgetModel', () => {
    it('should be createable', () => {
      const model = createTestModel(JSWidgetModel);
      expect(model).toBeInstanceOf(JSWidgetModel);
    });

    it('should be createable with a value', () => {
      const state = { html: '<h1>hello</h1>' };
      const model = createTestModel(JSWidgetModel, state);
      expect(model).toBeInstanceOf(JSWidgetModel);
      expect(model.get('html')).toEqual('<h1>hello</h1>');
    });
  });
});
