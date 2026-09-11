const MOBILE_BREAKPOINT = 768;

export default () => {
  const isMobile = typeof document !== 'undefined' && document.body && document.body.clientWidth > 0
    ? document.body.clientWidth <= MOBILE_BREAKPOINT
    : false;
  return {
    showNavigationBar: true,
    showEditor: true,
    showSidePreview: true,
    showStatusBar: true,
    showSideBar: !isMobile,
    showExplorer: !isMobile,
    scrollSync: true,
    focusMode: false,
    findCaseSensitive: false,
    findUseRegexp: false,
    sideBarPanel: 'menu',
    welcomeTourFinished: true,
    fontSize: 18,
    lineHeight: 1.6,
  };
};
