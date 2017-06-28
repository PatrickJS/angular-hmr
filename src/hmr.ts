export const MODULE_CONFIG = {
  'OnInit': 'hmrOnInit',
  'OnStatus': 'hmrOnStatus',
  'OnCheck': 'hmrOnCheck',
  'OnDecline': 'hmrOnDecline',
  'OnDestroy': 'hmrOnDestroy',
  'AfterDestroy': 'hmrAfterDestroy'
};

export function hmrModule(MODULE_REF: any, MODULE: any, CONFIG = MODULE_CONFIG) {
  if (MODULE['hot']) {
    MODULE['hot']['accept']();
    if (MODULE_REF.instance[MODULE_CONFIG['OnInit']]) {
      if (MODULE['hot']['data']) {
        MODULE_REF.instance[MODULE_CONFIG['OnInit']](MODULE['hot']['data']);
        Object.keys(MODULE['hot']['data']).forEach((key) => {
          MODULE['hot']['data'][key] = null;
        });
      }
    }
    if (MODULE_REF.instance[MODULE_CONFIG['OnStatus']]) {
      MODULE['hot']['apply'](function hmrOnStatus(status: any) {
        MODULE_REF.instance[MODULE_CONFIG['OnStatus']](status);
      });
    }
    if (MODULE_REF.instance[MODULE_CONFIG['OnCheck']]) {
      MODULE['hot']['check'](function hmrOnCheck(err: any, outdatedModules: any) {
        MODULE_REF.instance[MODULE_CONFIG['OnCheck']](err, outdatedModules);
      });
    }
    if (MODULE_REF.instance[MODULE_CONFIG['OnDecline']]) {
      MODULE['hot']['decline'](function hmrOnDecline(dependencies: any) {
        MODULE_REF.instance[MODULE_CONFIG['OnDecline']](dependencies);
      });
    }
    MODULE['hot']['dispose'](function hmrOnDestroy(store: any) {
      if (MODULE_REF.instance[MODULE_CONFIG['OnDestroy']]) {
        MODULE_REF.instance[MODULE_CONFIG['OnDestroy']](store);
      }
      MODULE_REF.destroy();
      if (MODULE_REF.instance[MODULE_CONFIG['AfterDestroy']]) {
        MODULE_REF.instance[MODULE_CONFIG['AfterDestroy']](store);
      }
    });
  }
  return MODULE_REF;
}
