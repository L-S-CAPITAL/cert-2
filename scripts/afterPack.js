const path = require('path');

exports.default = async function afterPack(context) {
  // @electron/fuses v2 is ESM-only, so it cannot be require()d from this
  // CommonJS hook. A dynamic import works on every supported Node version.
  const { flipFuses, FuseVersion, FuseV1Options } = await import('@electron/fuses');

  const name =
    context.packager.executableName ||
    context.packager.appInfo.productFilename;
  const ext = context.electronPlatformName === 'win32' ? '.exe' : '';
  const electronBinaryPath = path.join(context.appOutDir, `${name}${ext}`);

  await flipFuses(electronBinaryPath, {
    version: FuseVersion.V1,
    [FuseV1Options.RunAsNode]: false,
    [FuseV1Options.EnableCookieEncryption]: true,
    [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
    [FuseV1Options.EnableNodeCliInspectArguments]: false,
    [FuseV1Options.OnlyLoadAppFromAsar]: true,
  });
};
