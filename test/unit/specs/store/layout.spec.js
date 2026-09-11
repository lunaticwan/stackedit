import store from '../../../../src/store';
import specUtils from '../specUtils'; // eslint-disable-line no-unused-vars

describe('Layout store', () => {
  let originalClientWidth;

  beforeEach(() => {
    originalClientWidth = document.body.clientWidth;
  });

  afterEach(() => {
    Object.defineProperty(document.body, 'clientWidth', {
      value: originalClientWidth,
      configurable: true,
    });
  });

  it('mobile screen (<= 768px) collapses both left and right panels on initialization', async () => {
    Object.defineProperty(document.body, 'clientWidth', {
      value: 375,
      configurable: true,
    });
    store.commit('layout/setInitialized', false);

    await store.dispatch('layout/updateBodySize');

    const layoutSettings = store.getters['data/layoutSettings'];
    expect(layoutSettings.showExplorer).toBe(false);
    expect(layoutSettings.showSideBar).toBe(false);
  });

  it('PC screen (> 768px) expands both left and right panels on initialization', async () => {
    Object.defineProperty(document.body, 'clientWidth', {
      value: 1200,
      configurable: true,
    });
    store.commit('layout/setInitialized', false);

    await store.dispatch('layout/updateBodySize');

    const layoutSettings = store.getters['data/layoutSettings'];
    expect(layoutSettings.showExplorer).toBe(true);
    expect(layoutSettings.showSideBar).toBe(true);
  });

  it('resizing between mobile and PC screen size toggles panel defaults', async () => {
    Object.defineProperty(document.body, 'clientWidth', {
      value: 1200,
      configurable: true,
    });
    store.commit('layout/setInitialized', false);

    await store.dispatch('layout/updateBodySize');
    expect(store.getters['data/layoutSettings'].showExplorer).toBe(true);
    expect(store.getters['data/layoutSettings'].showSideBar).toBe(true);

    // Resize to mobile
    Object.defineProperty(document.body, 'clientWidth', {
      value: 500,
      configurable: true,
    });

    await store.dispatch('layout/updateBodySize');
    expect(store.getters['data/layoutSettings'].showExplorer).toBe(false);
    expect(store.getters['data/layoutSettings'].showSideBar).toBe(false);
  });
});
