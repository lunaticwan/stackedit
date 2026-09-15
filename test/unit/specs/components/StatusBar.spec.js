import { mount } from '@vue/test-utils';
import StatusBar from '../../../../src/components/StatusBar';
import editorSvc from '../../../../src/services/editorSvc';
import store from '../../../../src/store';

describe('StatusBar.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(StatusBar, {
      store,
    });
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.destroy();
    }
  });

  it('renders StatusBar correctly', () => {
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('.stat-panel').exists()).toBe(true);
  });

  it('renders created and updated date meta information', async () => {
    const createdTime = new Date('2026-01-01T10:00:00Z').getTime();
    const updatedTime = new Date('2026-01-02T15:30:00Z').getTime();
    store.commit('file/setItem', {
      id: 'test-file-1',
      created: createdTime,
      updated: updatedTime,
    });
    store.commit('file/setCurrentId', 'test-file-1');
    await wrapper.vm.$nextTick();

    const metaElements = wrapper.findAll('.stat-panel__meta');
    expect(metaElements.length).toBe(2);
    expect(metaElements.at(0).text()).toContain('생성:');
    expect(metaElements.at(1).text()).toContain('수정:');
  });

  it('computes text stats correctly', () => {
    editorSvc.clEditor = {
      getContent: () => 'Hello world!\n안녕하세요.',
      selectionMgr: {
        selectionEnd: 0,
        getSelectedText: () => '',
      },
    };

    wrapper.vm.computeText();
    expect(wrapper.vm.line).toBe(1);
  });

  it('copies markdown content when copyMarkdown is triggered', () => {
    editorSvc.clEditor = {
      getContent: () => '# Title\n\nContent',
      selectionMgr: {
        getSelectedText: () => '',
      },
    };

    document.execCommand = jest.fn();
    wrapper.vm.copyMarkdown();
    expect(wrapper.vm.copied).toBe(true);
  });
});
