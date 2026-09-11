import store from '../store';

/**
 * 안전한 객체 파싱 및 순환 참조 방지 함수.
 *
 * @param {*} obj - 파싱할 객체
 * @returns {*} 순환 참조 및 DOM 요소가 정제된 파싱 완료 객체
 */
export const safeParse = (obj) => {
  if (obj === null || obj === undefined) {
    return obj;
  }
  if (typeof obj !== 'object') {
    return obj;
  }
  try {
    const cache = new Set();
    const replacer = (key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (cache.has(value)) {
          return '[Circular Reference]';
        }
        if (typeof Element !== 'undefined' && value instanceof Element) {
          const tag = value.tagName ? value.tagName.toLowerCase() : 'Node';
          return `[DOM Element: <${tag}>]`;
        }
        cache.add(value);
      }
      if (typeof value === 'function') {
        return `[Function: ${value.name || 'anonymous'}]`;
      }
      return value;
    };
    return JSON.parse(JSON.stringify(obj, replacer));
  } catch (err) {
    return String(obj);
  }
};

/**
 * 애플리케이션의 현재 상태 컨텍스트 추출 함수.
 *
 * @returns {Object} 현재 파일, 워크스페이스, 모달 및 URL 위치 정보
 */
export const getAppContext = () => {
  try {
    const currentFile = store.getters['file/current'] || {};
    const currentWorkspace = store.getters['workspace/currentWorkspace'] || {};
    const activeModal = store.state.modal && store.state.modal.config
      ? store.state.modal.config.name
      : null;
    return {
      currentFileId: currentFile.id || null,
      currentFileName: currentFile.name || null,
      currentWorkspaceId: currentWorkspace.id || null,
      currentWorkspaceName: currentWorkspace.name || null,
      activeModal,
      hashLocation: window.location.hash || '',
      fullUrl: window.location.href || '',
    };
  } catch (err) {
    return {
      error: 'Failed to extract app context',
    };
  }
};

/**
 * 디버깅 전용 포맷 콘솔 로그 출력 함수.
 *
 * @param {string} category - 카테고리 (UI_EVENT, NAVIGATION, STORE_MUTATION 등)
 * @param {string} action - 이벤트 및 액션 명칭
 * @param {Object} details - 상세 데이터 객체
 */
export const logDebug = (category, action, details = {}) => {
  const timestamp = new Date().toISOString();
  const context = getAppContext();
  const payload = safeParse({
    timestamp,
    category,
    action,
    context,
    ...details,
  });

  /* eslint-disable no-console */
  console.log(`[JULES_DEBUG][${category}][${action}]`, payload);
  /* eslint-enable no-console */
};

/**
 * DOM 요소 메타데이터 추출 함수.
 *
 * @param {Element|EventTarget} el - 대상 DOM 요소
 * @returns {Object|null} DOM 요소 상세 메타데이터
 */
export const getElementInfo = (el) => {
  if (!el || typeof Element === 'undefined' || !(el instanceof Element)) {
    return null;
  }
  const selectors = [
    'button',
    'a',
    'select',
    'input',
    'textarea',
    '[role="button"]',
    '.button',
    '.menu-entry',
    '.explorer__node',
    '.navigation-bar__button',
    '.tree__item',
    '.gutter',
  ].join(',');

  const target = (el.closest && el.closest(selectors)) || el;

  return {
    tagName: target.tagName ? target.tagName.toLowerCase() : '',
    id: target.id || '',
    className: target.className || '',
    innerText: (target.innerText || target.textContent || '').trim().slice(0, 100),
    title: target.getAttribute ? (target.getAttribute('title') || target.getAttribute('aria-label') || '') : '',
    href: target.getAttribute ? (target.getAttribute('href') || '') : '',
    type: target.getAttribute ? (target.getAttribute('type') || '') : '',
    value: target.value !== undefined ? target.value : undefined,
    dataset: safeParse({ ...target.dataset }),
  };
};

/**
 * 전역 DOM 이벤트 리스너 감지기 초기화 함수.
 */
export const initDomLogger = () => {
  if (typeof window === 'undefined') {
    return;
  }

  // 캡처링 단계를 사용하여 이벤트 중단 여부와 무관하게 모든 클릭 수집
  window.addEventListener(
    'click',
    (event) => {
      const elInfo = getElementInfo(event.target);
      logDebug('UI_EVENT', 'CLICK', {
        event: {
          type: event.type,
          button: event.button,
          clientX: event.clientX,
          clientY: event.clientY,
        },
        targetElement: elInfo,
      });
    },
    true,
  );

  // 폼 입력 및 선택 변경 수집
  window.addEventListener(
    'change',
    (event) => {
      const elInfo = getElementInfo(event.target);
      logDebug('UI_EVENT', 'CHANGE', {
        event: { type: event.type },
        targetElement: elInfo,
        newValue: event.target ? event.target.value : null,
      });
    },
    true,
  );

  // 단축키 및 주요 키보드 입력 수집
  window.addEventListener(
    'keydown',
    (event) => {
      if (['Enter', 'Escape', 'Tab'].includes(event.key) || event.ctrlKey || event.metaKey) {
        const elInfo = getElementInfo(event.target);
        logDebug('UI_EVENT', 'KEYDOWN', {
          event: {
            key: event.key,
            code: event.code,
            ctrlKey: event.ctrlKey,
            metaKey: event.metaKey,
            shiftKey: event.shiftKey,
            altKey: event.altKey,
          },
          targetElement: elInfo,
        });
      }
    },
    true,
  );

  // URL 및 해시 네비게이션 변경 수집
  window.addEventListener('hashchange', (event) => {
    logDebug('NAVIGATION', 'HASH_CHANGE', {
      oldUrl: event.oldURL,
      newUrl: event.newURL,
      hash: window.location.hash,
    });
  });

  window.addEventListener('popstate', (event) => {
    logDebug('NAVIGATION', 'POPSTATE', {
      state: safeParse(event.state),
      url: window.location.href,
    });
  });
};

/**
 * Vuex Store 변이 및 액션 로깅 플러그인.
 *
 * @param {Object} storeInstance - Vuex Store 인스턴스
 */
export const vuexLoggerPlugin = (storeInstance) => {
  if (!storeInstance) {
    return;
  }

  storeInstance.subscribe((mutation) => {
    logDebug('STORE_MUTATION', mutation.type, {
      mutationType: mutation.type,
      payload: safeParse(mutation.payload),
    });
  });

  if (storeInstance.subscribeAction) {
    storeInstance.subscribeAction((action) => {
      logDebug('STORE_ACTION', action.type, {
        actionType: action.type,
        payload: safeParse(action.payload),
      });
    });
  }
};

/**
 * 디버그 로거 전체 초기화 함수.
 */
export const initDebugLogger = () => {
  initDomLogger();
  logDebug('SYSTEM', 'INIT', { message: 'Debug logger successfully initialized.' });
};

export default {
  initDebugLogger,
  logDebug,
  safeParse,
  getAppContext,
  getElementInfo,
  vuexLoggerPlugin,
};
