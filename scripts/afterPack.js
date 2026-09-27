const path = require('path');
const { Arch } = require('electron-builder');

// Executable name suffix per platform (mirrors electron-builder's own
// addElectronFuses): on macOS the fuses live inside the .app bundle.
const EXECUTABLE_EXT = {
  darwin: '.app',
  mas: '.app',
  win32: '.exe',
  linux: '',
};

// ASAR integrity is only implemented by Electron on macOS and Windows.
// electron-builder 26 embeds the header hash for those platforms (Info.plist
// ElectronAsarIntegrity / Windows "Integrity" resource) before afterPack
// runs, so the fuse can be enabled there. Linux has no support, so leave it
// off rather than rely on it.
const ASAR_INTEGRITY_PLATFORMS = new Set(['darwin', 'mas', 'win32']);

exports.default = async function afterPack(context) {
  // @electron/fuses v2 is ESM-only, so it cannot be require()d from this
  // CommonJS hook. A dynamic import works on every supported Node version.
  const { flipFuses, FuseVersion, FuseV1Options } = await import('@electron/fuses');

  const platform = context.electronPlatformName;
  const name =
    platform === 'linux'
      ? context.packager.executableName
      : context.packager.appInfo.productFilename;
  const electronBinaryPath = path.join(
    context.appOutDir,
    `${name}${EXECUTABLE_EXT[platform] ?? ''}`,
  );
  const isMac = platform === 'darwin' || platform === 'mas';

  await flipFuses(electronBinaryPath, {
    version: FuseVersion.V1,
    // Flipping fuses invalidates the ad-hoc signature of arm64 macOS
    // binaries; re-sign ad-hoc so unsigned local builds still launch.
    resetAdHocDarwinSignature: isMac && context.arch === Arch.arm64,
    [FuseV1Options.RunAsNode]: false,
    [FuseV1Options.EnableCookieEncryption]: true,
    [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
    [FuseV1Options.EnableNodeCliInspectArguments]: false,
    [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]:
      ASAR_INTEGRITY_PLATFORMS.has(platform),
    [FuseV1Options.OnlyLoadAppFromAsar]: true,
    // GrantFileProtocolExtraPrivileges is left at Electron's default (on):
    // the packaged renderer is loaded from file:// with loadFile.
  });
};
