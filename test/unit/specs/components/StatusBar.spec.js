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
