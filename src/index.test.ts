import {Config, IORuleMonoflow} from './index';
const read = require('fs').readFileSync;
const join = require('path').join;

function loadScript() {
  // import global script
  const script = read(join(__dirname, '..', 'dist', 'bundle.js')).toString('utf-8');
  eval(script);
}

describe("onInit", () => {
  // clean listeners
  afterEach(() => {
    messages.removeAllListeners();
  });

  it('runs without errors', () => {
    loadScript();
    messages.emit('onInit');
  });

  it('sets IO rules when syncIORules is enabled', () => {
    getSettings = () => ({
      syncIORules: true,
      rules: [{
        rule: 0,
        enable: true,
        low: 0,
        high: 1,
        target: 'in1',
        save: true,
        trigger: true,
        reverse: false,
        action: '1',
      }]
    } as Config);

    loadScript();
    messages.emit('onInit');

    expect(env.data.MONOFLOW_RULES).toBeDefined();
    expect(env.data.MONOFLOW_RULES[0]).toStrictEqual({
      enable: true,
      low: 0,
      high: 1,
      target: 'in1',
      save: true,
      trigger: true,
      reverse: false,
      action: 1,
    } as IORuleMonoflow);
  });

  it('sets BLE_TARGET if the collection has assigned one on onInit', () => {
    getSettings = () => ({} as Config);

    const colStore = {
      target: 'aa:bb:cc:dd:ee:ff',
    } as Record<any, any>;
    const mockCol = {
      set: (col: string, k: string, v: any) => (colStore[k] = v),
      get() {
        return {
          data: colStore,
          get: (k: string) => colStore[k],
          set: (k: string, v: any) => (colStore[k] = v),
        }
      }
    };

    (env.project as any) = {
      collectionsManager: {
        ensureExists: () => mockCol,
      },
    };

    loadScript();
    messages.emit('onInit');

    expect(env.data.BLE_TARGET).toBe('aa:bb:cc:dd:ee:ff');
  });

  it('sets BLE_TARGET if the collection has assigned one on onPeriodic', () => {
    getSettings = () => ({} as Config);

    const colStore = {
      target: 'aa:bb:cc:dd:ee:ff',
    } as Record<any, any>;
    const mockCol = {
      set: (col: string, k: string, v: any) => (colStore[k] = v),
      get() {
        return {
          data: colStore,
          get: (k: string) => colStore[k],
          set: (k: string, v: any) => (colStore[k] = v),
        }
      }
    };

    (env.project as any) = {
      collectionsManager: {
        ensureExists: () => mockCol,
      },
    };

    loadScript();
    messages.emit('onPeriodic');

    expect(env.data.BLE_TARGET).toBe('aa:bb:cc:dd:ee:ff');
  });
});