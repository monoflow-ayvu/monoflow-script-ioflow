import * as MonoUtils from "@fermuch/monoutils";

// based on settingsSchema @ package.json
type Config = {
}

const conf = new MonoUtils.config.Config<Config>();

messages.on('onInit', function() {
  platform.log('BLE script started');

  const foundBle = MonoUtils.collections.getBleDoc()?.data?.target || '';
  if (foundBle && foundBle != data.BLE_TARGET) {
    env.setData('BLE_TARGET', foundBle);
    platform.log('BLE target changed to: ' + foundBle);
  }
});