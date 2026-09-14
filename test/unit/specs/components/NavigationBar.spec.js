import { shallowMount } from '@vue/test-utils';
import NavigationBar from '../../../../src/components/NavigationBar';
import store from '../../../../src/store';
import specUtils from '../specUtils';

describe('NavigationBar.vue', () => {
  it('should toggle the explorer', async () => specUtils.checkToggler(
    NavigationBar,
    wrapper => wrapper.find('.navigation-bar__button--explorer-toggler').trigger('click'),
    () => store.getters['data/layoutSettings'].showExplorer,
    'toggleExplorer',
  ));

  it('should toggle the side bar', async () => specUtils.checkToggler(
    NavigationBar,
    wrapper => wrapper.find('.navigation-bar__button--stackedit').trigger('click'),
    () => store.getters['data/layoutSettings'].showSideBar,
    'toggleSideBar',
  ));

  it('should render font size and line height controls correctly', () => {
    const wrapper = shallowMount(NavigationBar, { store });
    const labels = wrapper.findAll('.navigation-bar__control-label');
    expect(labels.at(0).text()).toBe('크기');
    expect(labels.at(1).text()).toBe('행높이');

    const selects = wrapper.findAll('.navigation-bar__select');
    expect(selects.length).toBeGreaterThanOrEqual(2);
  });
});
