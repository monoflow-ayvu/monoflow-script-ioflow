import * as MonoUtils from "@fermuch/monoutils";

type IORuleMonoflow = {
  enable: boolean;
  low: number;
  high: number;
  target: string;
  save: boolean;
  trigger: boolean;
  reverse: boolean;
  action: number;
  // TODO: reverse_only: boolean
}

type IORule = {
  rule: number; // needs to be floored
  enable: boolean;
  low: number;
  high: number;
  target: string;
  save: boolean;
  trigger: boolean;
  reverse: boolean;
  action: string; // when syncing needs to be casted to number
  // TODO: reverse_only: boolean
}

// based on settingsSchema @ package.json
type Config = {
  syncIORules: boolean;
  rules: IORule[];
}

const conf = new MonoUtils.config.Config<Config>();

function updateInternalData() {
  const foundBle = MonoUtils.collections.getBleDoc()?.data?.target || '';
  if (foundBle && foundBle != data.BLE_TARGET) {
    env.setData('BLE_TARGET', foundBle);
    platform.log('BLE target changed to: ' + foundBle);
  }
}

messages.on('onInit', function() {
  platform.log('BLE script started');

  if (conf.get('syncIORules', false)) {
    const rawRules = conf.get('rules', []);
    const rules = rawRules.reduce((acc, rule) => {
      const ruleId = Math.floor(rule.rule);
      acc[ruleId] = {
        enable: Boolean(rule.enable),
        low: Number(rule.low),
        high: Number(rule.high),
        target: String(rule.target),
        save: Boolean(rule.save),
        trigger: Boolean(rule.trigger),
        reverse: Boolean(rule.reverse),
        action: Number(rule.action) || 2
      };

      return acc;
    }, {} as {
      [ruleId: number]: IORuleMonoflow
    });

    platform.log('setting Monoflow Rules to: ' + JSON.stringify(rules));
    env.setData('MONOFLOW_RULES', rules);
  }

  updateInternalData();
});

messages.on('onPeriodic', function() {
  updateInternalData();
})